# 最佳实践

<div class="highlight-block highlight-tip"> 样式编写规范 </div>

1. 每个布局板块在编写样式时都写上注释，在.css文件中都标注下当前这些样式应用于哪个板块
    
2. 对于嵌套层里的元素设置样式时，最好使用后代选择器，避免元素的class名重复
    
3. css文件里，外层的写在上面，嵌套里层的写在里面
    
<div class="highlight-block highlight-tip"> 布局 </div>

1. 从上至下，**一个布局板块就写一个div，****里面的****版心再套个div**，版心里的**内容区域再分别套div.**.....布局区域>版心>内容块
    
    1. 布局div：定上高度和背景颜色
        
    2. 如果内容区域和版型边框有距离，则给版心设置padding，注意设置完padding之后，需要调整下版心的width和height
        
    3. 版心和内容区域：定上高度和宽度，根据需要设置其它的
        
    
    ```CSS
    <!-- 顶部导航条 -->
    <div class="topbar">
        <!-- 版心 -->
        <div class="container clearfix">
            <!-- 左侧的欢迎区 -->
            <div class="welcome leftfix">
               
            </div>
            <!-- 右侧的导航区 -->
            <div class="topbar-nav rightfix">
               
            </div>
        </div>
    </div>
    ```
    
2. 一堆东西纵向排列，一堆东西横向排列，一般直接用列表 `ul`
    
3. 2个行内元素如何垂直排列？第一个行内元素使用div包裹
    
<div class="highlight-block highlight-tip"> 行内元素 </div>

1. 对于页面上的普通文字，直接用`span`包裹，便于调样式
    
2. 行内元素之间的间隔使用 `margin-left` `margin-right` 控制