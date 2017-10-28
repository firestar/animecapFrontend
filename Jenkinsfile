pipeline {
  agent {
    dockerfile {
      filename 'JenkinsCI-Docker/slave/Dockerfile'
    }
  }
  environment {
    DOCKER_ACCOUNT = 'firestarthehack'
    IMAGE_VERSION = '1.01'
    IMAGE_NAME = 'animecapfrontend'
    RANCHER_STACK_NAME = 'AnimeCap'
    RANCHER_SERVICE_NAME = 'Frontend'
    RANCHER_SERVICE_URL = 'http://34.215.0.188:8080/v2-beta'
  }
  stages {
    stage('BeginProcess') {
      steps {
        sh 'rm -rf dockerbuild/ && rm -rf node_modules/'
      }
    }
    stage('Build') {
      steps {
        sh 'npm install && npm run ng build'
      }
    }
    stage('Docker Build') {
      steps {
        sh "mkdir dockerbuild/"
        sh "mkdir dockerbuild/static/"
        sh "cp dist/* dockerbuild/static/"
        sh 'zip -r static.zip dockerbuild/static/'
        archiveArtifacts(artifacts: 'static.zip', onlyIfSuccessful: true)
        sh "cp Dockerfile dockerbuild/Dockerfile && cp nginx.vh.default.conf dockerbuild/nginx.vh.default.conf"
        sh "cd dockerbuild/ && docker build -t ${env.DOCKER_ACCOUNT}/${env.IMAGE_NAME}:${env.IMAGE_VERSION} ./"
      }
    }
    stage('Publish Latest Image') {
      steps {
        docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
          app.push("${env.DOCKER_ACCOUNT}/${env.IMAGE_NAME}:${env.IMAGE_VERSION}")
        }
      }
    }
    stage('Deploy') {
      steps {
        rancher(environmentId: '1a5', ports: '', environments: '1i12214', confirm: true, image: "${env.DOCKER_ACCOUNT}/${env.IMAGE_NAME}:${env.IMAGE_VERSION}", service: "${env.RANCHER_STACK_NAME}/${env.RANCHER_SERVICE_NAME}", endpoint: "${env.RANCHER_SERVICE_URL}", credentialId: 'rancher-server')
      }
    }
  }
}
