const core = require('@actions/core')
const github = require('@actions/github')

;(async () => {
    try {
        console.log('-'.repeat(20))
        console.log('github.context', github.context)
        console.log('-'.repeat(20))
        console.log('process.env:', process.env)
        console.log('-'.repeat(20))
        console.log('-'.repeat(20))
        console.log('-'.repeat(20))

        console.log('release', github.context.payload.release)
        console.log('repo', github.context.repo)
        console.log('tag_name', github.context.payload.release.tag_name)

        if (!github.context.payload.release) {
            console.log('Skipping non-release:', github.context.eventName)
            // return
        }

        const parsedTag = github.context.ref.replace('refs/tags/', '')
        console.log('parsedTag:', parsedTag)
        console.log('GITHUB_REF_NAME:', process.env.GITHUB_REF_NAME)

        const updateMajor = core.getInput('major')
        console.log('major:', updateMajor)
        const updateMinor = core.getInput('minor')
        console.log('minor:', updateMinor)

        const { owner, repo } = github.context.repo
        console.log('owner:', owner)
        console.log('repo:', repo)

        // const octokit = github.getOctokit(githubToken)
        // console.log('octokit:', octokit)

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
