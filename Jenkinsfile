pipeline {
    agent any

    tools {
        nodejs 'Node18'   // <-- FIXED: Use Node 18 LTS
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
                    // Extract repo path from GIT_URL
                    REPO_PATH = sh(script: '''
                        echo "$GIT_URL" \
                        | sed 's|https://github.com/||' \
                        | sed 's|.git$||'
                    ''', returnStdout: true).trim()

                    // Send pending status to GitHub
                    if (env.GITHUB_TOKEN) {
                        sh """
                            curl -s -X POST \
                              -H "Authorization: token ${GITHUB_TOKEN}" \
                              -H "Accept: application/vnd.github.v3+json" \
                              https://api.github.com/repos/${REPO_PATH}/statuses/${GIT_COMMIT} \
                              -d '{\"state\":\"pending\",\"description\":\"Build started\",\"context\":\"Jenkins CI\"}'
                        """
                    } else {
                        echo "⚠️ No GitHub token available"
                    }
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
                            sh 'npm run lint || true'
                        }
                    }
                }

                stage('Frontend Lint') {
                    steps {
                        dir(FRONTEND_DIR) {
                            echo '🔍 Frontend Lint...'
                            sh 'npm run lint || true'
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
                            sh 'npm test'
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
                            echo '📁 Validating backend structure...'
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

    // Function to update GitHub commit status using API
    // Requires GitHub credentials stored in Jenkins with ID 'github-token'
    def updateGitHubStatus(String state, String description) {
        try {
            // Get repository info from GIT_URL
            def repoInfo = env.GIT_URL.tokenize('/').takeRight(2)
            def owner = repoInfo[0].replace('.git', '')
            def repo = repoInfo[1].replace('.git', '')
            def commit = env.GIT_COMMIT

            echo "Updating GitHub status: ${state} - ${description}"

            // Use GitHub credentials if available
            withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                sh """
                    curl -X POST \
                    -H "Authorization: token \${GITHUB_TOKEN}" \
                    -H "Accept: application/vnd.github.v3+json" \
                    https://api.github.com/repos/${owner}/${repo}/statuses/${commit} \
                    -d '{
                        "state": "${state}",
                        "target_url": "${env.BUILD_URL}",
                        "description": "${description}",
                        "context": "Jenkins CI"
                    }'
                """
            }
            echo "✓ GitHub status updated successfully"
        } catch (Exception e) {
            echo "⚠️ Could not update GitHub status: ${e.getMessage()}"
            echo "Make sure 'github-token' credential is configured in Jenkins"
        }
    }

    post {
        success {
            echo '✅ Pipeline passed!'
            script {
                sh """
                    curl -s -X POST \
                      -H "Authorization: token ${GITHUB_TOKEN}" \
                      -H "Accept: application/vnd.github.v3+json" \
                      https://api.github.com/repos/${REPO_PATH}/statuses/${GIT_COMMIT} \
                      -d '{\"state\":\"success\",\"description\":\"Build passed\",\"context\":\"Jenkins CI\"}'
                """
            }
        }

        failure {
            echo '❌ Pipeline failed!'
            script {
                sh """
                    curl -s -X POST \
                      -H "Authorization: token ${GITHUB_TOKEN}" \
                      -H "Accept: application/vnd.github.v3+json" \
                      https://api.github.com/repos/${REPO_PATH}/statuses/${GIT_COMMIT} \
                      -d '{\"state\":\"failure\",\"description\":\"Build failed\",\"context\":\"Jenkins CI\"}'
                """
            }
        }

        always {
            echo '🧹 Cleaning workspace...'
            cleanWs()
        }
    }
}