export const mockData = {
  object_kind: 'push',
  event_name: 'push',
  before: '95790bf891e76fee5e1747ab589903a6a1f80f22',
  after: 'bfacd86c647935aea532f29421fe83c6a6111260',
  ref: 'refs/heads/master',
  checkout_sha: 'bfacd86c647935aea532f29421fe83c6a6111260',
  user_id: 4,
  user_name: 'John Smith',
  user_username: 'jsmith',
  user_email: 'john@example.com',
  user_avatar:
    'https://s.gravatar.com/avatar/d4c74594d841139328695756648b6bd6?s=8://s.gravatar.com/avatar/d4c74594d841139328695756648b6bd6?s=80',
  project_id: 15,
  project: {
    id: 15,
    name: 'Diaspora',
    description: '',
    web_url: 'http://example.com/mike/diaspora',
    avatar_url: null,
    git_ssh_url: 'git@github.com:infraboard/mpaas.git',
    git_http_url: 'http://example.com/mike/diaspora.git',
    namespace: 'Mike',
    visibility_level: 0,
    path_with_namespace: 'mike/diaspora',
    default_branch: 'master',
    homepage: 'http://example.com/mike/diaspora',
    url: 'git@github.com:infraboard/mpaas.git',
    ssh_url: 'git@github.com:infraboard/mpaas.git',
    http_url: 'http://example.com/mike/diaspora.git'
  },
  repository: {
    name: 'Diaspora',
    url: 'git@github.com:infraboard/mpaas.git',
    description: '',
    homepage: 'http://example.com/mike/diaspora',
    git_http_url: 'http://example.com/mike/diaspora.git',
    git_ssh_url: 'git@github.com:infraboard/mpaas.git',
    visibility_level: 0
  },
  commits: [
    {
      id: 'b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327',
      message:
        'Update Catalan translation to e38cb41.\n\nSee https://gitlab.com/gitlab-org/gitlab for more information',
      title: 'Update Catalan translation to e38cb41.',
      timestamp: '2011-12-12T14:27:31+02:00',
      url: 'http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327',
      author: {
        name: 'Jordi Mallach',
        email: 'jordi@softcatala.org'
      },
      added: ['CHANGELOG'],
      modified: ['app/controller/application.rb'],
      removed: []
    },
    {
      id: 'bfacd86c647935aea532f29421fe83c6a6111260',
      message: 'fixed readme',
      title: 'fixed readme',
      timestamp: '2012-01-03T23:36:29+02:00',
      url: 'http://example.com/mike/diaspora/commit/bfacd86c647935aea532f29421fe83c6a6111260',
      author: {
        name: 'GitLab dev user',
        email: 'gitlabdev@dv6700.(none)'
      },
      added: ['CHANGELOG'],
      modified: ['app/controller/application.rb'],
      removed: []
    }
  ],
  total_commits_count: 4
}