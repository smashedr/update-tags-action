const core = require('@actions/core')
const github = require('@actions/github')
const semver = require('semver')

;(async () => {
    try {
        // console.log('-'.repeat(40))
        // console.log('github.context', github.context)
        // console.log('-'.repeat(40))
        // console.log('process.env:', process.env)
        // console.log('-'.repeat(40))
        // console.log('release', github.context.payload.release)
        // console.log('-'.repeat(40))

        if (!github.context.payload.release) {
            console.log('Skipping non-release:', github.context.eventName)
            // return
        }

        const githubToken = core.getInput('token')
        console.log('token:', githubToken)
        const tagPrefix = core.getInput('prefix')
        console.log('prefix:', tagPrefix)
        const updateMajor = core.getInput('major')
        console.log('major:', updateMajor)
        const updateMinor = core.getInput('minor')
        console.log('minor:', updateMinor)

        const { owner, repo } = github.context.repo
        console.log('owner:', owner)
        console.log('repo:', repo)

        const sha = github.context.sha
        console.log('sha:', sha)

        const tag_name = github.context.payload.release.tag_name
        console.log('tag_name', tag_name)

        const major = semver.major(tag_name)
        console.log('major', major)
        const minor = semver.minor(tag_name)
        console.log('minor', minor)

        console.log('-'.repeat(40))

        const tag = `${tagPrefix}${major}`
        console.log('tag', tag)
        const ref = `tags/${tag}`
        console.log('ref', ref)

        const octokit = github.getOctokit(githubToken)

        try {
            const getRef = await octokit.rest.git.getRef({
                owner,
                repo,
                ref,
            })
            console.log(`Current sha: ${getRef.data.object.sha}`)
            if (sha !== getRef.data.object.sha) {
                console.log(`Updating tag: "${tag}" to sha: ${sha}`)
                await octokit.rest.git.updateRef({
                    owner,
                    repo,
                    ref,
                    sha,
                })
            } else {
                console.log(`Tag: "${tag}" already points to sha: ${sha}`)
            }
        } catch (e) {
            console.log(e.message)
            console.log(`Creating new tag: ${tag} to sha: ${sha}`)
            await octokit.rest.git.createRef({
                owner,
                repo,
                ref,
                sha,
            })
        }

        core.setFailed('set to always fail')
    } catch (error) {
        console.log(error)
        core.setFailed(error.message)
    }
})()
