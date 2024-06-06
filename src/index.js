const core = require('@actions/core')
const github = require('@actions/github')
const semver = require('semver')
const { parse } = require('csv-parse/sync')

;(async () => {
    try {
        console.log('-'.repeat(40))
        console.log('process.env:', process.env)
        console.log('-'.repeat(40))
        console.log('-'.repeat(40))
        console.log('github.context', github.context)
        console.log('-'.repeat(40))
        console.log('-'.repeat(40))

        // Check Tag
        console.log('ref', github.context.ref)
        console.log('payload.ref', github.context.payload.ref)
        if (!github.context.payload.ref.startsWith('refs/tags/')) {
            core.info(`Skipping due to no tags: ${github.context.payload.ref}`)
            // return
        }
        const newTag = github.context.ref.replace('refs/tags/', '')
        console.log('newTag:', newTag)

        // Process Inputs
        const githubToken = core.getInput('token')
        // console.log('token:', githubToken)
        const tagPrefix = core.getInput('prefix')
        console.log('prefix:', tagPrefix)
        const updateMajor = core.getInput('major')
        console.log('major:', updateMajor)
        const updateMinor = core.getInput('minor')
        console.log('minor:', updateMinor)

        const emptyInput = core.getInput('fake')
        console.log('emptyInput:', emptyInput)
        if (emptyInput) {
            console.log('EMPTY INPUT PRESENT')
        }

        let inputTags = core.getInput('tags')
        console.log('tags:', inputTags)
        const parsedTags = parse(inputTags, {
            delimiter: ',',
            trim: true,
            relax_column_count: true,
        }).flat()
        console.log('parsedTags:', parsedTags)

        console.log('-'.repeat(40))
        console.log('-'.repeat(40))

        // Set Variables
        const { owner, repo } = github.context.repo
        console.log('owner:', owner)
        console.log('repo:', repo)
        const sha = github.context.sha
        console.log('sha:', sha)
        // const tag_name = github.context.payload.release.tag_name
        // console.log('tag_name', tag_name)
        const major = semver.major(newTag)
        console.log('major', major)
        const minor = semver.minor(newTag)
        console.log('minor', minor)

        // // Collect Tags
        // const tags = []
        // if (updateMajor !== 'false') {
        //     tags.push(`${tagPrefix}${major}`)
        // }
        // if (updateMinor !== 'false') {
        //     tags.push(`${tagPrefix}${major}.${minor}`)
        // }
        // console.log('tags', tags)
        // if (!tags.length) {
        //     core.notice('Major and Minor false, nothing to do!')
        //     return
        // }
        //
        // // Process Tags
        // const octokit = github.getOctokit(githubToken)
        // for (const tag of tags) {
        //     core.info(`----- Processing tag: ${tag} -----`)
        //     const ref = `tags/${tag}`
        //     console.log('ref', ref)
        //     const reference = await getRef(octokit, owner, repo, ref)
        //     // console.log('reference', reference)
        //     if (reference) {
        //         if (sha !== reference.data.object.sha) {
        //             console.log(`Updating tag: "${tag}" to sha: ${sha}`)
        //             await updateRef(octokit, owner, repo, ref, sha)
        //         } else {
        //             console.log(`Tag: "${tag}" already points to sha: ${sha}`)
        //         }
        //     } else {
        //         console.log(`Creating new tag: "${tag}" to sha: ${sha}`)
        //         await createRef(octokit, owner, repo, ref, sha)
        //     }
        // }

        core.setFailed('set to always fail for job retry')
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()

async function getRef(octokit, owner, repo, ref) {
    try {
        return await octokit.rest.git.getRef({
            owner,
            repo,
            ref,
        })
    } catch (e) {
        core.info(e.message)
        return null
    }
}

async function createRef(octokit, owner, repo, ref, sha) {
    try {
        return await octokit.rest.git.createRef({
            owner,
            repo,
            ref: `refs/${ref}`,
            sha,
        })
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.error(`Failed to create tag: ${ref}`)
    }
}

async function updateRef(octokit, owner, repo, ref, sha) {
    try {
        await octokit.rest.git.updateRef({
            owner,
            repo,
            ref,
            sha,
        })
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.error(`Failed to update tag: ${ref}`)
    }
}
