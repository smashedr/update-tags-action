const core = require('@actions/core')
const github = require('@actions/github')
const semver = require('semver')

;(async () => {
    try {
        console.log('-'.repeat(40))
        console.log('github.context', github.context)
        console.log('-'.repeat(40))
        console.log('process.env:', process.env)
        console.log('-'.repeat(40))
        console.log('release', github.context.payload.release)
        console.log('-'.repeat(40))

        if (!github.context.payload.release) {
            console.log('Skipping non-release:', github.context.eventName)
            // return
        }

        // const parsedTag = github.context.ref.replace('refs/tags/', '')
        // console.log('parsedTag:', parsedTag)
        // console.log('GITHUB_REF_NAME:', process.env.GITHUB_REF_NAME)

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

        console.log('-'.repeat(40))
        const octokit = github.getOctokit(githubToken)

        console.log('sha:', github.context.sha)

        const tag_name = github.context.payload.release.tag_name
        console.log('tag_name', tag_name)

        const major = semver.major(tag_name)
        console.log('major', major)
        const minor = semver.minor(tag_name)
        console.log('minor', minor)

        console.log('-'.repeat(40))
        // console.log('minor', semver.pre(tag_name))

        const ref = `${tagPrefix}${major}`
        console.log('ref', ref)

        try {
            const gitRef = await octokit.rest.git.gitRef({
                owner,
                repo,
                ref: `tags/${tagPrefix}${major}`,
            })
            console.log('gitRef', gitRef)
        } catch (e) {
            console.log(e.message)
        }

        // const release = await octokit.rest.repos.getReleaseByTag({
        //     owner: github.context.repo.owner,
        //     repo: github.context.repo.repo,
        //     tag: releaseTag,
        // })
        // console.log('release:', release)
        // if (!release?.data) {
        //     return core.setFailed(`Release Not Found: ${releaseTag}`)
        // }

        core.setFailed('this is set to always fail')
        console.log('AHHHHHHHHHHHH')
    } catch (error) {
        console.log(error)
        core.setFailed(error.message)
    }
})()
