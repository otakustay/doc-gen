<h1>{{name}}</h1>
<section id="repo-card">
    <div class="github-card" data-github="{{owner}}/{{name}}" data-width="400" data-height="150"></div>
    <script src="http://lab.lepture.com/github-cards/widget.js"></script>
</section>
<section id="meta-data">
    <p>
        <span class="meta-name">更新时间</span>
        <span class="meta-value">{{updateTime}}</span>
    </p>
    <p>
        <span class="meta-name">项目URL</span>
        <a class="meta-value" href="{{repoURL}}">{{repoURL}}</a>
    </p>
    <p>
        <span class="meta-name">分支</span>
        <span class="meta-value">{{branch}}</span>
    </p>
    <p>
        <span class="meta-name">最后更新</span>
        <span class="meta-value">{{commitMessage}}</span>
    </p>
    <p>
        <span class="meta-name">版本URL</span>
        <a class="meta-value" href="{{url}}">{{sha}}</a>
    </p>
    <p>
        <span class="meta-name">最后提交者</span>
        <span class="meta-value">{{author}} ({{authorEmail}})</span>
    </p>
    <div id="author-card">
        <div class="github-card" data-github="{{author}}" data-width="400" data-height="150"></div>
        <script src="http://lab.lepture.com/github-cards/widget.js"></script>
    </div>
</section>