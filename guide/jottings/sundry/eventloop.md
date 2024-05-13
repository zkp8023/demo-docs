#  浏览器事件循环
## 1. 概念
---
### 程序

> 程序是一组计算机或其他执行系统能识别和执行的<span color="#00b050">指令序列</span> , 具体到实物上可以理解成我们使用各种编程语言所书写的各种代码指令
<hr />

### 进程
> 进程是指操作系统中管理和调度计算资源的基本单元,**可以简单理解为正在执行中的程序和其所被执行时所分配的内存空间**
>

:::tip
 - **在操作系统中每个进程都有自己独立的内存空间,一个进程下可以拥有多个线程, 当内存被回收那么其下面的各个线程也会被杀死,**
 <!-- <br /> -->
 - **浏览器中存在多个线程:**
     - 主进程(Browser process): 协调管理其他进程,负责浏览器界面显示、用户交互、子进程的管理和通信等。
     - 网络进程(Network process): 负责网络资源的加载,处理网络请求
     - 插件进程(Plugin process): 负责插件的运行,处理插件内容
     - GPU进程(GPU process ): 处理页面的3D绘制及其他与 `GPU` 相关的任务,
     - <b color="#f00">渲染进程(Renderer process ==>事件循环所在的进程)</b>: 浏览器的每个标签页都有自己的渲染进程, 主要负责页面渲染,解析`HTML`、`CSS`、`JavaScript`等内容,并将渲染结果显示在页面上
:::
<hr />

### 线程

> 线程是<b color="#f00">进程中</b>的执行单元(具体干活的人,他是程序指令序列的执行者),一个进程可以拥有多个线程,每个线程都有自己的堆栈、局部变量等,但线程间共享进程的内存空间和其他公共资源-->(房子内干活的多个人都可以使用房间内的各种资源,如全局变量,文件资源等..)

:::tip
**进程被创建的时候,会默认创建一个主线程,主线程在执行代码过程中可能会根据需要来创建一些子线程,这些线程之间可以同步和通信,然后通过合理的调度和分配,使得多个线程可以并发地执行不同的任务。**
:::

## 2. 浏览器事件循环
 ### 2.1. 渲染主线程
>渲染进程下的主线程,负责解析`HTML`、`CSS`、执行`JavaScript`等工作,

 ### 2.2. 子线程
  >交互线程,计时线程,异步IO线程等...,配合主线程,通过各线程间通信和合理调度来完成多个任务并发执行的线程
 ### 2.3. 消息队列
 >存放待执行任务的队列,主线程不断从消息队列中取出可执行任务并执行

 <b color="#646cff">消息队列中的待执行任务由主线程以及各个子线程添加,根据任务类型(`taskType`)的不同来决定将当前任务添加到哪个消息队列中</b>

### 2.4. js同步执行阻塞:
:::details js的执行阻塞页面的渲染
```html
<body>
    <h1>给我一个div</h1>
    <button>按钮</button>
    <script>
        const h = document.querySelector('h1');
        const button = document.querySelector('button');
        // 延时函数
        function delay(delay) {
            const now = Date.now();
            while (Date.now() - now < delay) { };
        }

        button.addEventListener('click', () => {
            h.innerText = 9999
            //h1元素内容已更改,但页面不会立即显示,渲染任务被阻塞,直到delay函数执行完毕
            console.log('h.innerText', h.innerText)
            delay(3000)
        })

    </script>
</body>
```
:::
---
> 代码在执⾏过程中，会遇到⼀些⽆法⽴即处理的任务，⽐如：
> - 计时完成后需要执⾏的任务 —— `setTimeout` 、 `setInterval`
> - ⽹络通信完成后需要执⾏的任务 -- `XHR` 、 `Fetch`
> - ⽤户操作后需要执⾏的任务 -- `addEventListener`

如果让渲染主线程等待这些任务的时机达到，就会导致主线程长期处于「阻塞」的状态，从⽽导致浏览器「卡死」

 <DemoBlock><a-image preview src="/docs/images/javaScript/js同步执行.png"/></DemoBlock>

 ### 2.5. js异步执行:
 > js采用一步去来解决主线程阻塞问题
 <DemoBlock><a-image preview src="/docs/images/javaScript/js异步执行.png"/></DemoBlock>
---

### 2.6. 事件循环
---

事件循环也叫消息循环,是浏览器 <b>渲染主线程的工作方式</b>,这是一个非常繁忙的线程,它负责解析`css`,`html`,执行`js`,渲染页面等繁杂的工作,但有时候需要处理的任务是非常耗时(异步)的,比如`网络请求,定时器,事件处理回调`等...,这些都不是可以立即可以执行的任务,如果让主线程一直等待的话那会导致页面的阻塞,所以主线程会开启一些子线程来协同完成工作,将这些耗时任务交给对应的子线程去处理,而主线程继续执行其他的代码,当这些耗时任务达到可执行条件的时候,会被子线程添加到对应的消息(任务)队列中等待主线程来执行
<br />
主线程代码执行完成后,会到消息队列中查看是否有可执行任务,有的话就取出执行,没有的话就等待新的任务到来,主线程这种不断执行代码,去任务队列中取任务执行的往复过程就是事件循环
js同步执行时的效果:
:::tip
- **关于任务(消息)队列:** <br />
    过去是把任务队列分为宏队列和微队列,但现在的浏览器并没有宏队列的概念,而是增加了其他一系列具体的队列(如:延时队列,交互队列等等),W3C规定的是同类型的任务必须在同一队列,任务本身没有优先级,但不同的任务队列有不同的优先级,浏览器必须有一个微队列,微队列具有最高的优先级,每一次事件循环中主线程会优先到微队列中查看是否有可执行任务,如果没有才会去其他队列查看其他任务,添加任务到微队列的方式有: `Promise的then方法回调,MutationObserver的DOM变动回调`
 ----
- **关于消息循环:** <br />
   在`Chrome`的源码中, 它会开启一个不会结束的for循环(C++编写),每次循环从消息队列中取出第一个任务执行,而其他线程在合适的时候将任务加入到队列末尾等待执行即可
:::