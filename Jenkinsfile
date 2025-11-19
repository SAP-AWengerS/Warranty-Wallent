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
                    // Set GitHub status to pending using Jenkins plugin
                    try {
                        // Using githubNotify step from GitHub plugin
                        githubNotify context: 'Jenkins CI',
                                     description: 'Build started',
                                     status: 'PENDING'
                    } catch (Exception e) {
                        echo "GitHub status update not available: ${e.getMessage()}"
                        echo "Install GitHub plugin or configure GitHub webhook for status updates"
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
                try {
                    githubNotify context: 'Jenkins CI',
                                 description: 'Build passed',
                                 status: 'SUCCESS'
                } catch (Exception e) {
                    echo "GitHub status update not available: ${e.getMessage()}"
                }
            }
        }

        failure {
            echo '❌ Pipeline failed!'
            script {
                try {
                    githubNotify context: 'Jenkins CI',
                                 description: 'Build failed',
                                 status: 'FAILURE'
                } catch (Exception e) {
                    echo "GitHub status update not available: ${e.getMessage()}"
                }
            }
        }

        unstable {
            echo '⚠️ Pipeline unstable!'
            script {
                try {
                    githubNotify context: 'Jenkins CI',
                                 description: 'Build unstable',
                                 status: 'ERROR'
                } catch (Exception e) {
                    echo "GitHub status update not available: ${e.getMessage()}"
                }
            }
        }

        always {
            echo '🧹 Cleaning workspace...'
            cleanWs()
        }
    }
}
