build:
	npm run test
	npm run build
	git add docs
	git commit -a -m 'Update build'
	git push bukvar