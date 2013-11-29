<style scoped="scoped">
    #repo-card, #author-card {
        float: right;
        margin-right: 40px;
    }
    #author-card {
        margin-top: -60px;
    }

    #meta-data {
        font-size: 14px;
    }
    #meta-data p {
        margin: 1em 0;
    }

    .meta-name {
        display: inline-block;
        width: 100px;
    }
    .meta-name::after {
        content: "："
    }
</style>
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
</section>
<div id="author-card">
    <div class="github-card" data-github="{{username}}" data-width="400" data-height="150"></div>
    <script src="http://lab.lepture.com/github-cards/widget.js"></script>
</div>