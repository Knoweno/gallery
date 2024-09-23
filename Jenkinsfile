 pipeline {
    agent any
    triggers {
        // Jenkins to listen to GitHub webhooks
        githubPush()
    }
    stages {
        stage('Checkout Code') {
            steps {
                git credentialsId: 'GitConnect', url: 'https://github.com/Knoweno/gallery.git'
            }
        }
         stage('Install NodeJS Dependencies') {
            steps {
                sh 'npm install'
            }
        }
         /*stage('Run Application') {
            steps {
                sh 'npm start'
            }
        }*/

        stage('Zip files') {
            steps {
                script {
                    sh '''
                        tar --exclude='Jenkinsfile' --exclude='README.md' -czf /usr/share/nginx/html/Moringa-IP1.tar.gz -C /var/lib/jenkins/workspace/ Moringa-IP1
                    '''
                }
            }
        }
        stage('Unzip files') {
            steps {
                script {
                    sh '''
                        tar -xzf /usr/share/nginx/html/Moringa-IP1.tar.gz -C /usr/share/nginx/html/ 
                    '''
                }
            }
        }
        
    stage('Kill running application') {
            steps {
                script {
                    sh '''
                        if lsof -i:8002; then
                            echo "Stopping application using port 8002..."
                            PID=$(lsof -t -i:8002)
                            kill -9 $PID
                        else
                            echo "No application is using port 8002."
                        fi
                    '''
                }
            }
        }
        
        stage('Deploy Application') {
            steps {
                script {
                    sh '''
                        rm -rf /usr/share/nginx/html/* && \
                        cp -R /usr/share/nginx/html/Moringa-IP1/* /usr/share/nginx/html/ && \
                        rm -rf /usr/share/nginx/html/Moringa-IP1 /usr/share/nginx/html/Moringa-IP1.tar.gz
                    '''
                }
            }
        }
        stage('Start Service') {
            steps {
                script {
                    sh 'npm start --prefix /usr/share/nginx/html/'
                }
            }
        }

           stage('Cleanup Workspace') {
            steps {
                 echo 'Clean....'
                // Clean up the workspace to remove all files created during the build
                cleanWs()
            }
        }



    }
    post {
        success {
            echo '✅ Build succeeded! 🎉'

        }
        failure {
            echo '❌ Build failed. Please check the logs for details.'
        }
        always {
            echo '🔄 Pipeline execution completed.'
        }
    }
}
