node {
    checkout scm
	stage('Build') {
		docker.image('node:9').inside{
			sh 'npm install'
			sh 'npm run ng build'
		}
	}
	stage('Prep Image') {
		sh "mkdir dockerbuild/"
		sh "mkdir dockerbuild/static/"
		sh "cd build/;ls"
		sh "cd build/static/;ls"
		sh "cp -r dist/* dockerbuild/static/"
		sh "cp Dockerfile dockerbuild/Dockerfile"
		sh "cp nginx.vh.default.conf dockerbuild/nginx.vh.default.conf"
	}
	stage('Build Docker and Publish') {
		sh "docker login -u ${DOCKER_PRIVATE_USR} -p ${DOCKER_PRIVATE_PSW} ${PRIVATE_REGISTRY}"
		def builtImage = docker.build("firestarthehack/animecapfrontend:${BUILD_NUMBER}", "./dockerbuild")
		builtImage.push()
		builtImage.push('latest')
	}
}
