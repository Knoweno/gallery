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
                sh 'npm install99'
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
