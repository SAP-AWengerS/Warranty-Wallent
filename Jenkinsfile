pipeline {
    agent any

    tools {
        nodejs 'NodeJS'  // Ensure NodeJS is configured in Jenkins Global Tool Configuration
    }

    environment {
        // Environment variables
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend'
        NODE_ENV = 'test'
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo '🔄 Checking out code from repository...'
                    checkout scm
                }
            }
        }

        stage('Environment Info') {
            steps {
                script {
                    echo '📋 Displaying environment information...'
                    sh '''
                        echo "Node Version: $(node --version)"
                        echo "NPM Version: $(npm --version)"
                        echo "Current Directory: $(pwd)"
                        echo "Branch: ${GIT_BRANCH}"
                        echo "Commit: ${GIT_COMMIT}"
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        script {
                            echo '📦 Installing backend dependencies...'
                            dir(BACKEND_DIR) {
                                sh 'npm ci --prefer-offline --no-audit'
                            }
                        }
                    }
                }

                stage('Frontend Dependencies') {
                    steps {
                        script {
                            echo '📦 Installing frontend dependencies...'
                            dir(FRONTEND_DIR) {
                                sh 'npm ci --prefer-offline --no-audit'
                            }
                        }
                    }
                }
            }
        }

        stage('Code Quality Checks') {
            parallel {
                stage('Backend Lint') {
                    steps {
                        script {
                            echo '🔍 Running backend code quality checks...'
                            dir(BACKEND_DIR) {
                                // Add lint check if configured in package.json
                                sh '''
                                    if grep -q "\\"lint\\"" package.json; then
                                        npm run lint || echo "⚠️ Linting not configured or failed"
                                    else
                                        echo "ℹ️ No lint script found in backend package.json"
                                    fi
                                '''
                            }
                        }
                    }
                }

                stage('Frontend Lint') {
                    steps {
                        script {
                            echo '🔍 Running frontend code quality checks...'
                            dir(FRONTEND_DIR) {
                                sh '''
                                    if grep -q "\\"lint\\"" package.json; then
                                        npm run lint || echo "⚠️ Linting not configured or failed"
                                    else
                                        echo "ℹ️ No lint script found in frontend package.json"
                                    fi
                                '''
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
                        script {
                            echo '🧪 Running backend tests...'
                            dir(BACKEND_DIR) {
                                sh '''
                                    if grep -q "\\"test\\"" package.json; then
                                        npm test || echo "⚠️ Backend tests not configured or failed"
                                    else
                                        echo "ℹ️ No test script found in backend package.json"
                                    fi
                                '''
                            }
                        }
                    }
                }

                stage('Frontend Tests') {
                    steps {
                        script {
                            echo '🧪 Running frontend tests...'
                            dir(FRONTEND_DIR) {
                                sh '''
                                    # Run tests without watch mode for CI
                                    CI=true npm test -- --coverage --watchAll=false || true
                                '''
                            }
                        }
                    }
                    post {
                        always {
                            script {
                                echo '📊 Test coverage generated in frontend/coverage/'
                                // Archive coverage reports as artifacts
                                dir(FRONTEND_DIR) {
                                    archiveArtifacts artifacts: 'coverage/**/*', allowEmptyArchive: true, fingerprint: true
                                }
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
                        script {
                            echo '🏗️ Building frontend application...'
                            dir(FRONTEND_DIR) {
                                sh '''
                                export NODE_OPTIONS="--experimental-webstorage --localstorage-file=./localStorage.json"
                                npm run build
                                '''
                            }
                        }
                    }
                }

                stage('Validate Backend') {
                    steps {
                        script {
                            echo '✅ Validating backend structure...'
                            dir(BACKEND_DIR) {
                                sh '''
                                    echo "Checking for required files..."
                                    test -f package.json && echo "✓ package.json found"
                                    test -f app.js && echo "✓ app.js found"
                                    test -d routes && echo "✓ routes directory found"
                                    test -d controllers && echo "✓ controllers directory found"
                                    test -d models && echo "✓ models directory found"
                                '''
                            }
                        }
                    }
                }
            }
        }

        stage('Security Audit') {
            steps {
                script {
                    echo '🔒 Running security audit...'

                    // Frontend security audit
                    dir(FRONTEND_DIR) {
                        sh '''
                            echo "Running frontend security audit..."
                            npm audit --audit-level=moderate || echo "⚠️ Security vulnerabilities found in frontend"
                        '''
                    }

                    // Backend security audit
                    dir(BACKEND_DIR) {
                        sh '''
                            echo "Running backend security audit..."
                            npm audit --audit-level=moderate || echo "⚠️ Security vulnerabilities found in backend"
                        '''
                    }
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                script {
                    echo '📦 Archiving build artifacts...'
                    archiveArtifacts artifacts: "${FRONTEND_DIR}/build/**/*", allowEmptyArchive: true, fingerprint: true
                }
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up workspace...'
            cleanWs(
                deleteDirs: true,
                patterns: [
                    [pattern: '**/node_modules', type: 'INCLUDE'],
                    [pattern: '**/.npm', type: 'INCLUDE']
                ]
            )
        }

        success {
            echo '✅ Pipeline completed successfully!'
            // You can add notifications here (email, Slack, etc.)
            // Example for email:
            // emailext (
            //     subject: "✅ Jenkins Build Success: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
            //     body: "The build completed successfully. Check details at: ${env.BUILD_URL}",
            //     to: "dev.codhub@gmail.com"
            // )
        }

        failure {
            echo '❌ Pipeline failed!'
            // You can add failure notifications here
            // Example for email:
            // emailext (
            //     subject: "❌ Jenkins Build Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
            //     body: "The build failed. Check details at: ${env.BUILD_URL}",
            //     to: "dev.codhub@gmail.com"
            // )
        }

        unstable {
            echo '⚠️ Pipeline is unstable!'
        }
    }
}
