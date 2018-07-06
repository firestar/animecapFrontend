node {
    checkout scm
    def app
    def nodeImage = docker.build("buildprocess/node", "./JenkinsCI-Docker/node/")
    def dockerImage = docker.build("buildprocess/docker", "./JenkinsCI-Docker/docker/")
    withEnv([
        'DOCKER_ACCOUNT=firestarthehack',
        'IMAGE_VERSION=1.04',
        'IMAGE_NAME=animecapfrontend'
    ]){
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
        stage('Publish Latest Image') {
            app.push("${env.IMAGE_VERSION}")
            app.push("latest")
        }
    }
}
