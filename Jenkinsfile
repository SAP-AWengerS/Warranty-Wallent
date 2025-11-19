// Function to update GitHub commit status using API
// Requires GitHub credentials stored in Jenkins with ID 'GITHUB_TOKEN'
def updateGitHubStatus(String state, String description) {
    try {
        // Get repository info from GIT_URL
        def repoInfo = env.GIT_URL.tokenize('/').takeRight(2)
        def owner = repoInfo[0].replace('.git', '')
        def repo = repoInfo[1].replace('.git', '')
        def commit = env.GIT_COMMIT

        echo "Updating GitHub status: ${state} - ${description}"
        echo "Repository: ${owner}/${repo}"
        echo "Commit SHA: ${commit}"

        // Check if this is a PR build
        if (env.CHANGE_ID) {
            echo "ℹ️ This is a PR build (PR #${env.CHANGE_ID})"

            // For PR builds, check if commit exists in target repo
            // If it fails, it might be from a fork
            def commitCheckStatus = sh(
                script: """
                    curl -s -o /dev/null -w "%{http_code}" \
                    -H "Accept: application/vnd.github.v3+json" \
                    https://api.github.com/repos/${owner}/${repo}/commits/${commit}
                """,
                returnStdout: true
            ).trim()

            if (commitCheckStatus != "200") {
                echo "⚠️ Commit ${commit} not found in ${owner}/${repo}"
                echo "This PR might be from a forked repository."
                echo "Skipping GitHub status update to avoid API errors."
                echo "Consider using GitHub Checks API or GitHub Actions for fork PRs."
                return
            }
        }

        // Use GitHub credentials if available
        withCredentials([string(credentialsId: 'GITHUB_TOKEN', variable: 'GITHUB_TOKEN')]) {
            def response = sh(
                script: """
                    curl -X POST \
                    -H "Authorization: token \${GITHUB_TOKEN}" \
                    -H "Accept: application/vnd.github.v3+json" \
                    https://api.github.com/repos/${owner}/${repo}/statuses/${commit} \
                    -d '{
                        "state": "${state}",
                        "target_url": "${env.BUILD_URL}",
                        "description": "${description}",
                        "context": "Jenkins CI"
                    }' \
                    -w "\\nHTTP_STATUS:%{http_code}"
                """,
                returnStdout: true
            ).trim()

            echo "API Response: ${response}"

            if (response.contains('HTTP_STATUS:201') || response.contains('HTTP_STATUS:200')) {
                echo "✓ GitHub status updated successfully"
            } else {
                echo "⚠️ GitHub status update may have failed"
            }
        }
    } catch (Exception e) {
        echo "⚠️ Could not update GitHub status: ${e.getMessage()}"
        echo "Make sure 'GITHUB_TOKEN' credential is configured in Jenkins"
    }
}

pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend'
        NODE_ENV = 'test'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '🔄 Checking out code...'
                checkout scm
                script {
                    // Notify GitHub about build status using GitHub Status API
                    updateGitHubStatus('pending', 'Build started')
                }
            }
        }

        stage('Environment Info') {
            steps {
                sh '''
                    echo "Node Version: $(node --version)"
                    echo "NPM Version: $(npm --version)"
                    echo "Directory: $(pwd)"
                    echo "Branch: ${GIT_BRANCH}"
                    echo "Commit: ${GIT_COMMIT}"
                '''
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Backend Deps') {
                    steps {
                        dir(BACKEND_DIR) {
                            echo '📦 Installing backend deps...'
                            sh 'npm ci --prefer-offline --no-audit'
                        }
                    }
                }

                stage('Frontend Deps') {
                    steps {
                        dir(FRONTEND_DIR) {
                            echo '📦 Installing frontend deps...'
                            sh 'npm ci --prefer-offline --no-audit'
                        }
                    }
                }
            }
        }

        stage('Lint') {
            parallel {

                stage('Backend Lint') {
                    steps {
                        dir(BACKEND_DIR) {
                            echo '🔍 Backend Lint...'
                            script {
                                if (fileExists('package.json')) {
                                    sh 'npm run lint'
                                } else {
                                    echo "ℹ️ No lint script found"
                                }
                            }
                        }
                    }
                }

                stage('Frontend Lint') {
                    steps {
                        dir(FRONTEND_DIR) {
                            echo '🔍 Frontend Lint...'
                            script {
                                if (fileExists('package.json')) {
                                    sh 'npm run lint'
                                } else {
                                    echo "ℹ️ No lint script found"
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir(BACKEND_DIR) {
                            echo '🧪 Backend Tests...'
                            sh 'CI=true npm test -- --coverage --watchAll=false'
                        }
                    }
                }

                stage('Frontend Tests') {
                    steps {
                        dir(FRONTEND_DIR) {
                            echo '🧪 Frontend Tests...'
                            sh 'CI=true npm test -- --coverage --watchAll=false'
                        }
                    }
                    post {
                        always {
                            dir(FRONTEND_DIR) {
                                archiveArtifacts artifacts: 'coverage/**/*', allowEmptyArchive: true
                            }
                        }
                    }
                }
            }
        }

        stage('Build') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        dir(FRONTEND_DIR) {
                            echo '🏗️ Building frontend...'
                            sh '''
                                export NODE_OPTIONS="--experimental-webstorage --localstorage-file=./localStorage.json"
                                npm run build
                            '''
                        }
                    }
                }

                stage('Validate Backend Structure') {
                    steps {
                        dir(BACKEND_DIR) {
                            echo '📁 Validating backend files...'
                            sh '''
                                test -f package.json
                                test -f app.js
                                test -d routes
                                test -d controllers
                                test -d models
                            '''
                        }
                    }
                }
            }
        }

        stage('Security Audit') {
            steps {
                echo '🔒 Running npm audit...'
                dir(FRONTEND_DIR) {
                    sh 'npm audit --audit-level=moderate || true'
                }
                dir(BACKEND_DIR) {
                    sh 'npm audit --audit-level=moderate || true'
                }
            }
        }

        stage('Archive Build Artifacts') {
            steps {
                echo '📦 Archiving build artifacts...'
                archiveArtifacts artifacts: "${FRONTEND_DIR}/build/**/*", allowEmptyArchive: true
            }
        }
    }

    post {

        success {
            echo '✅ Pipeline succeeded!'
            script {
                updateGitHubStatus('success', 'Build passed')
            }
        }

        failure {
            echo '❌ Pipeline failed!'
            script {
                updateGitHubStatus('failure', 'Build failed')
            }
        }

        unstable {
            echo '⚠️ Pipeline unstable!'
            script {
                updateGitHubStatus('error', 'Build unstable')
            }
        }

        always {
            echo '🧹 Cleaning workspace...'
            cleanWs()
        }
    }
}
