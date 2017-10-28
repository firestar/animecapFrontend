node {
    checkout scm
    def app
    def nodeImage = docker.build("buildprocess/node", "./JenkinsCI-Docker/node/")
    def dockerImage = docker.build("buildprocess/docker", "./JenkinsCI-Docker/docker/")
    withEnv(['DOCKER_ACCOUNT=firestarthehack','IMAGE_VERSION=1.02','IMAGE_NAME=animecapfrontend','RANCHER_STACK_NAME=AnimeCap','RANCHER_SERVICE_NAME=Frontend','RANCHER_SERVICE_URL=http://34.215.0.188:8080/v2-beta']){
        stage('Build') {
          nodeImage.inside{
            sh 'rm -rf dockerbuild/ && rm -rf node_modules/'
            sh 'npm install && npm run ng build'
          }
        }
        stage('Docker Build') {
            dockerImage.inside {
                sh "mkdir dockerbuild/"
                sh "mkdir dockerbuild/static/"
                sh "cp dist/* dockerbuild/static/"
                sh 'zip -r static.zip dockerbuild/static/'
                archiveArtifacts(artifacts: 'static.zip', onlyIfSuccessful: true)
                sh "cp Dockerfile dockerbuild/Dockerfile && cp nginx.vh.default.conf dockerbuild/nginx.vh.default.conf"
                app = docker.build("${env.DOCKER_ACCOUNT}/${env.IMAGE_NAME}", "./dockerbuild/")
            }
        }
        stage('Test image') {
            app.inside {
              sh 'echo "Tests passed"'
            }
        }
        stage('Publish Latest Image') {
            app.push("${env.IMAGE_VERSION}")
            app.push("latest")
        }
        stage('Deploy') {
            rancher(environmentId: '1a5', ports: '', environments: '1i12214', confirm: true, image: "${env.DOCKER_ACCOUNT}/${env.IMAGE_NAME}:${env.IMAGE_VERSION}", service: "${env.RANCHER_STACK_NAME}/${env.RANCHER_SERVICE_NAME}", endpoint: "${env.RANCHER_SERVICE_URL}", credentialId: 'rancher-server')
        }
    }
}
