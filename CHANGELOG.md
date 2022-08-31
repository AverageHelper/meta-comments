# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
as far as makes sense for GUI software.

## [1.1.0] - 2022-08-31
### Added
- Added an option to parse files referenced in .gitignore
- List alternative projects to the README.

### Changed
- No longer parse files referenced in .gitignore (by default)

## [1.0.1] - 2022-08-20
### Fixed
- Killed an annoying toast when opening long files that we wouldn't parse anyway.

### Changed
- We now skip parsing documents written in languages we don't have regex to parse.

## [1.0.0] - 2022-08-16
### Added
- Initial release

[Unreleased]: https://github.com/AverageHelper/meta-comments/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/AverageHelper/meta-comments/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/AverageHelper/meta-comments/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/AverageHelper/meta-comments/releases/tag/v1.0.0
