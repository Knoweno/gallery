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
    stage('Prepare Downloadable Artifacts') {
            steps {
                script {
                    def buildNumber = env.BUILD_NUMBER
                    def pipelineName = env.JOB_NAME.replaceAll('/', '-')
                    def BRANCH = env.GIT_BRANCH.tokenize('/').last()
                    env.TAR_FILE = "${BRANCH}-${pipelineName}-${buildNumber}.tar.gz"

                    echo "Building branch: ${BRANCH}"

                    echo "Creating tar file: ${env.TAR_FILE}"
                }
            }
        }
        /*stage('Archive Artifacts') {
                steps {
                   /* script {
                    // Archive the tar file created during the build
                    archiveArtifacts artifacts: "/usr/share/nginx/html/${env.TAR_FILE}", allowEmptyArchive: false
                    echo "Archived ${env.TAR_FILE}"
                    archiveArtifacts artifacts: '*.tar.gz'
                }
                    //archiveArtifacts artifacts: "${env.TAR_FILE}", allowEmptyArchive: false
                    archiveArtifacts artifacts: '*.tar.gz', followSymlinks: false
                }
            }
*/
               stage('Archive Artifacts') {
            steps {
                script {
                    // Archive the tar file, excluding Jenkinsfile and README.md
                    sh """
                        tar --exclude='Jenkinsfile' --exclude='README.md' -czf /usr/share/nginx/html/${env.TAR_FILE} -C /usr/share/nginx/html .
                    """
                    
                    // Archive the resulting tar file
                    archiveArtifacts artifacts: "/usr/share/nginx/html/${env.TAR_FILE}", allowEmptyArchive: false
                    echo "Archived ${env.TAR_FILE}"
                }
            }
        }
        stage('Zip & Copy files') {
            steps {
                script {
                    sh '''

                        tar --exclude='Jenkinsfile' --exclude='README.md' -czf /usr/share/nginx/html/${TAR_FILE} -C /var/lib/jenkins/workspace/ Moringa-IP1
                    '''
                }
            }
        }
        stage('Unzip files') {
            steps {
                script {
                    sh '''

                        find /usr/share/nginx/html/ -mindepth 1 ! -name '*.tar.gz' -print0 | xargs -0 rm -rf && \
                        tar -xzf /usr/share/nginx/html/${TAR_FILE}  -C /usr/share/nginx/html/
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
                                echo "No application is using port 8002..."
                            fi
                        '''
                        sh 'sleep 10'
                    }
                }
            }
        
        stage('Deploy Application') {
            steps {
                script {
                    sh '''

                        cp -R /usr/share/nginx/html/Moringa-IP1/* /usr/share/nginx/html/ && \
                        rm -rf /usr/share/nginx/html/Moringa-IP1 /usr/share/nginx/html/${TAR_FILE}
                    '''
                }
            }
        }
        stage('Start Service') {
            steps {
                script {
                   // sh 'npm start --prefix /usr/share/nginx/html/'
                   //run the application in the background
                   //sh 'nohup npm start --prefix /usr/share/nginx/html/ &'
                  // sh 'nohup npm start --prefix /usr/share/nginx/html/ > /usr/share/nginx/html/app.log 2>&1 &'
                  //use python script to run the application in the background
                   sh 'sudo python3 /usr/bin/application-scripts/run-Ip1-npm.py'

                }
            }
        }
        
           stage('Cleanup Workspace') {
            steps {
                echo "Waiting for 1 minute before continuing..."
                 echo 'Clean....'
                // Clean up the workspace to remove all files created during the build
               // cleanWs()
            }
        }



    }
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
    }
}
