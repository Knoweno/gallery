 pipeline {
    agent any
    triggers {
        
        githubPush()
        
    }
      environment {
        DEPLOY_HOOK_URL = 'https://api.render.com/deploy/srv-crohik08fa8c738rt07g?key=E0Tx2vGH97w' 
        RENDER_API_KEY = credentials('render-api-key') // Store your Render API key in Jenkins credentials
        SERVICE_ID = 'gallery' // Replace with your Render service ID //https://gallery-gq2n.onrender.com
        RENDER_URL = 'https://api.render.com/deploy/srv-croglm56l47c73fnhddg?key=wEe8ff0bDFE' // Render API endpoint for deployment
        

        SLACK_WEBHOOK = credentials('JenkinsSlackConnection') // Use the webhook URL from credentials
        RENDER_SITE_URL = 'https://gallery-gytx.onrender.com' // Your deployed Render site URL
        SLACK_CHANNEL = 'C07NEKL3JMU'  // Your Slack channel ID
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
            stage('Deploy to Render.com') {
                        steps {
                            script {
                                def response = sh(script: """
                                    curl -X POST ${DEPLOY_HOOK_URL}
                                """, returnStdout: true).trim()
                                
                                echo "Deployment Response: ${response}"
                            }
                        }

                    }
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
        
        stage('Zip & Copy files') {
            steps {
                script {
                    sh '''

                        tar --exclude='Jenkinsfile' --exclude='README.md' -czf /usr/share/nginx/html/${TAR_FILE} -C /var/lib/jenkins/workspace/ Moringa-IP1
                    '''
                    // sh "tar -czf '${env.TAR_FILE}' *.js" 
                    // sh "tar --exclude='Jenkinsfile' --exclude='README.md' -czf '${env.TAR_FILE}' *"
                    sh 'sudo cp ./scripts/run-Ip1-npm.py /usr/bin/application-scripts/' //script to run the application in the background. Ensure you give permissions
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
         stage('Deploy to Render') {
            steps {
                script {
                    def response = sh(script: """
                        curl -X POST ${RENDER_URL} \
                        -H "Authorization: Bearer ${RENDER_API_KEY}" \
                        -H "Content-Type: application/json" \
                        -d '{
                            "serviceId": "${SERVICE_ID}"
                        }'
                    """, returnStdout: true).trim()
                    
                    echo "Deployment Response: ${response}"
                }
            }
        }
/*
    stage('Slack Notification') {
    echo 'Deploy Passed Sending notification to Slack...'
           script {
                def message = "Deploy  to render for  ${env.JOB_NAME} #${env.BUILD_NUMBER} is successful. Check URL: ${RENDER_SITE_URL}"

                sh """
                    curl -X POST --data-urlencode 'payload={"channel": "#your-channel", "username": "jenkins", "text": "${message}", "icon_emoji": ":warning:"}' ${SLACK_WEBHOOK}
                """
            }
        }*/
        stage('Slack Notification') {
             steps {

            script {

                //echo 'Build succeeded! Sending Slack notification...'
                def successMessage = """
                Jenkins build ${env.JOB_NAME} #${env.BUILD_NUMBER} has been successfully deployed!
                \nCheck it out here: ${RENDER_SITE_URL}
                """
                // Sending a success message to Slack
                sh """
                    curl -X POST --data-urlencode 'payload={
                        "channel": "${SLACK_CHANNEL}",
                        "username": "jenkins",
                        "text": "${successMessage}",
                        "icon_emoji": ":white_check_mark:"
                    }' ${SLACK_WEBHOOK}
                """
            }}
        }
 
            
        stage('Stop & Undeploy on GCP') {
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
        
        stage('Deploy Application to GCP') {
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
                  //use python script to run the application in the background
                   sh 'sudo python3 /usr/bin/application-scripts/run-Ip1-npm.py'

                }
            }
        }
            stage('Archive Artifacts') {
            steps {
                script{
                    sh """
                 rm -f Jenkinsfile README.md && \
                     tar -czf '${env.TAR_FILE}' *
                    """
                }
                archiveArtifacts artifacts: "${env.TAR_FILE}", allowEmptyArchive: false
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
            echo 'Pipeline completed successfully!'

        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
    }




}
