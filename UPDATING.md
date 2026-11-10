# Updating Linkding

Check the [upstream tags](https://github.com/sissbruecker/linkding/tags) and release notes for the latest stable release. Verify that `sissbruecker/linkding:<version>` exists on Docker Hub for both amd64 and arm64. Update `images.linkding.source.dockerTag` in `startos/manifest/index.ts`. The package uses the standard image, not the `-plus` image.
