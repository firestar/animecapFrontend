pipeline {
  agent any
  stages {
    stage('BeginProcess') {
      steps {
        parallel(
          "BeginProcess": {
            script {
              echo "[${env.JOB_NAME} #${env.BUILD_NUMBER}] Started the pipeline (<${env.BUILD_URL}|Open>)"
            }
          },
          "Delete old build": {
            sh 'rm -rf dockerbuild/'
          }
        )
      }
    }
    stage('Build') {
      steps {
        script {
          echo "[${env.JOB_NAME} #${env.BUILD_NUMBER}] Compiling Spring application"
        }
        sh 'npm install'
        sh 'npm run ng build'
        script {
          echo "[${env.JOB_NAME} #${env.BUILD_NUMBER}] Compiled Spring application"
        }

      }
    }
    stage('Docker Build') {
      steps {
        parallel(
          "Build Docker Image": {
            script {
              echo "[${env.JOB_NAME} #${env.BUILD_NUMBER}] Building Docker image"
            }

            sh '''mkdir dockerbuild/
            mkdir dockerbuild/static
cp dst/* dockerbuild/static/
cp Dockerfile dockerbuild/Dockerfile
cd dockerbuild/
docker build -t firestarthehack/animecapfrontend:latest ./'''
            script {
              echo "[${env.JOB_NAME} #${env.BUILD_NUMBER}] Built Docker image"
            }


          },
          "Save Artifact": {
            script {
              echo "[${env.JOB_NAME} #${env.BUILD_NUMBER}] Archived artifacts"
            }
            archiveArtifacts(artifacts: 'build/libs/*.jar', onlyIfSuccessful: true)
          }
        )
      }
    }
    stage('Publish Latest Image') {
      steps {
        script {
          echo "[${env.JOB_NAME} #${env.BUILD_NUMBER}] Docker image publishing to DockerHub"
        }

        sh 'docker push firestarthehack/animecapfrontend:latest'
        script {
          echo "[${env.JOB_NAME} #${env.BUILD_NUMBER}] Docker image published to DockerHub"
        }

      }
    }
    stage('Deploy') {
      steps {
        script {
          echo "[${env.JOB_NAME} #${env.BUILD_NUMBER}] Deploying docker image to Rancher"
        }

        rancher(environmentId: '11', ports: '8080:80', environments: '11', confirm: true, image: 'firestarthehack/animecapfrontend:latest', service: 'AnimeCap/Frontend', endpoint: 'http://212.47.248.38:8080/v2-beta', credentialId: 'rancher-server')
        script {
          echo "[${env.JOB_NAME} #${env.BUILD_NUMBER}] Deployed docker image to Rancher"
        }

      }
    }
    stage('Finished') {
      steps {
        script {
          echo "[${env.JOB_NAME} #${env.BUILD_NUMBER}] Finished pipeline"
         }

      }
    }
  }
}