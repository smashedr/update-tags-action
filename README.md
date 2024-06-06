# VirusTotal Action

Update Tags on Release for Semantic Versions

> [!NOTE]   
> Please submit a [Feature Request](https://github.com/cssnr/virustotal-action/discussions/categories/feature-requests)
> for new features
> or [Open an Issue](https://github.com/cssnr/virustotal-action/issues) if you find any bugs.

## Inputs

| input | required | default | description          |
|-------|----------|---------|----------------------|
| token | Yes      | -       | secrets.GITHUB_TOKEN |
| major | No       | true    | Update Major Tag     |
| minor | No       | true    | Update Minor Tag     |

```yaml
  - name: "Update Tags"
    uses: cssnr/update-tags-action@v1
    with:
      token: ${{ secrets.GITHUB_TOKEN }}
      major: true
      minor: true
```
