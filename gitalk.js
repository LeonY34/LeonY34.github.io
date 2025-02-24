const gitalk = new Gitalk({
    clientID: 'Ov23li88tDepTLlGFzht',
    clientSecret: 'b3aee24393b2d1ee67f7b42bced5abb3743d6d87',
    repo: 'CleverTalk',      // The repository of store comments,
    owner: 'LeonY34',
    admin: ['LeonY34'],
    id: location.pathname,      // Ensure uniqueness and length less than 50
    distractionFreeMode: false  // Facebook-like distraction free mode
})
  
gitalk.render('gitalk-container')