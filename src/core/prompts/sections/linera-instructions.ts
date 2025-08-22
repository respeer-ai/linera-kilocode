export const lineraInstructions = () => {
	return [
		`
    # Rules from linera documentation:
    # Scaffolding new Linera project
    Always scaffold a new Linera project using the command: \`linera project new\`

    # 运行目录
    创建项目初始框架后，\`cd\`进入项目目录，运行所有命令和脚本都必须在项目目录下进行。项目目录是指\`linera project new\`命令生成的目录。以后执行的所有命令不要用\`cd\`反复切换目录，所有命令都在项目目录下执行。

    # Linera SDK版本
    Linera SDK版本必须和应用框架中的版本一致，不能使用其他版本的Linera SDK。可以通过\`linera --version\`获取版本信息。
    
    # Linera SDK documentation
    Always use context7 MCP tool to query Linera SDK documentation with the following repositories:
    - linera-io/linera-documentation
    - linera-io/linera-protocol

    # Rust documentation
    Always use docsrs-mcp MCP tool to query Rust documentation

    # 项目名称
    项目名称必须是小写字母，单词之间用下划线分隔，不能包含其他字符。项目名称必须符合Rust的命名规范。

    # 变量命令
    变量命令必须使用小写字母，单词之间用下划线分隔，不能包含其他字符。变量命令必须符合Rust的命名规范。

    # Rust模块组织
    必须使用module_name.rs + module_name目录的方式组织模块，不允许使用module_name/mod.rs的方式组织模块。

    # 工作流程
    必须严格遵循如下工作流程：
    1. 使用\`linera project new\`命令生成应用框架，编译并测试通过
    2. 分析用户需求意图，从公开文档寻找资料，识别业务目标，了解用户需要实现一个什么样的应用
    3. 从context7 MCP工具中学习Linera SDK知识，不允许跳过这个步骤，如果失败，请询问用户并重试
    4. 从docs-rs MCP工具中学习Rust知识，不允许跳过这个步骤，如果失败，请询问用户并重试
    5. 从context7 MCP工具学习前端开发知识（next, vue, react等），不允许跳过这个步骤，如果失败，请询问用户并重试
    6. 根据用户需求意图和学习到的知识，设计应用的后端和前端架构，拆分用户需求并输出文档，该文档是后续编码工作的参考
    7. 与用户确认输出文档，并根据用户意见修改文档
    8. 拥有详尽的设计文档后且用户同意后，开始分析领域模型和脚手架生成的代码层次，并输出文档
    9. 将上述设计拆分成可迭代实施的任务
    10. 按照任务的优先级和依赖关系，逐步实现代码
    
    # 单元测试
    修改任何代码之前必须编写单元测试用例，没有测试用例的任何代码将被拒绝。单元测试流程见TDD实践。由于全部单元测试耗时较长，你只需要运行变更部分的单元测试以及依赖变更部分的单元测试。

    # 系统测试
    功能点完成之后，必须编写系统测试用例，测试用例必须覆盖功能点的所有逻辑分支，没有系统测试用例的任何代码将被拒绝。

    # 前端实现
    前端实现必须适配大小屏幕，支持手机、平板和桌面端。前端实现必须使用最新的前端技术栈，如Next.js、Vue.js或React.js等。

    # Lint
    每次单元测试变更完成必须运行Lint检查，确保代码符合Rust和前端的Lint规范。Lint检查必须通过，否则所有代码将被拒绝。Lint后的代码必须确保单元测试通过，否则所有代码将被拒绝。

    # 严格遵循TDD实践
    所有实现必须严格遵循TDD实践，步骤如下：
    1. 写一个空函数，使用占位实现，不要实现具体逻辑
    2. 编写步骤1创建的函数的测试用例，测试用例必须覆盖函数的所有逻辑分支
    3. 运行该测试用例，测试用例必须执行，否则所有代码将被拒绝
    4. 修改函数实现，反复上述步骤直到测试用例全部通过，未通过单元测试的代码将被全部拒绝
    5. 重构代码，确保代码质量和可读性，重复代码、不能被人阅读的代码、层次错乱的代码将被拒绝
    6. 反复上述步骤确保重构后的测试用例仍然通过，未通过单元测试的代码将被全部拒绝
    不遵循上述TDD实践流程的所有代码将被拒绝。

    # 只要变更代码就必须运行单元测试
    只要变更代码，无论是增加函数，删除函数，还是变更函数实现，修改结构体，修改定义声明等，都必须运行单元测试，确保所有单元测试通过。未通过单元测试的代码将被拒绝。

    # 每次只允许变更一个函数
    每次只允许变更一个函数，不允许一次性变更多个函数。函数变更完成后，运行单元测试通过再继续下一步。一次性变更多个函数的代码将被拒绝。

    # 严格遵循DDD实践
    所有设计和实现必须严格遵循DDD实践，步骤如下：
    1. 分析领域模型，识别领域对象和领域服务
    2. 将领域对象和领域服务映射到代码中，确保代码结构符合领域模型
    3. 确保领域对象和领域服务的职责清晰，避免职责混乱
    4. 确保领域对象和领域服务的实现符合领域模型的业务逻辑和其他所有要求
    不遵循DDD实践的所有设计和实现将被拒绝。

    # 分层实现
    编写代码必须遵循分层实现的原则，先实现底层模块，再实现上层模块。具体步骤如下：
    1. 分析\`linera project new\`生成的应用框架的模块层次，从底层开始实现
    2. 一个模块的依赖层次实现完成之前，不允许开始实现这个模块
    没有给出模块依赖层次的实现将被拒绝。

    # Application state
    为了节省Gas，不要使用RegisterView<XXXState>这样的方式存储应用状态数据，将XXXState的成员分散开，用不同的View包裹。Gas的读取写入不同的数据大小是不一样的。

    # 前端集成
    - 前端直接访问service提供的graphql接口，不需要通过Linera typescript SDK访问。
    - 前端向后端请求只能通过service提供的graphql接口，前端没有能力直接访问contract和state，这两者是运行在链上的。
    - 你需要从service获取前端能够访问的graphql接口，以供后续前端集成使用。

    # 应用框架中的宏
    不允许修改应用框架中的任何宏，包括过程宏、派生宏、函数宏等。

    # 文档管理
    开发过程中创建的所有设计文档，TODO列表，需求分析文档等，必须用Markdown格式编写，管理在和项目顶层Cargo.toml处于同级的documentation目录下（例如项目名称为project_name，文档目录为project_name/documentation）。迭代过程中需要根据进度更新文档内容。

    # 设计、计划、开发等证据证据列举
    任何设计、计划、开发任务执行完成后，都必须列举从文档学习到的修改依据。缺乏详细修改依据的输出将被拒绝。

    # 超时设置
    除了网络请求使用系统超时，其他任务如测试、分析、计划等都没有超时时间限制，直到任务完成为止。

    # 状态管理的实现和测试
    - 状态管理需要将状态计算和状态存储分离，状态计算使用函数实现，状态存储使用View实现。
    - 状态计算函数必须是纯函数，没有副作用。状态存储View必须是可变的。
    - 状态存储不用做单元测试，状态计算函数必须做单元测试。
    - 如下示例中，\`_generate_new_tile\`函数是状态计算函数，\`generate_new_tile\`函数是状态存储函数，你必须给\`_generate_new_tile\`编写单元测试。
    \`\`\`rust
    impl State {
      fn _generate_new_tile(&mut self) -> (position: usize, value: i32) {
        let seed = self.rng_seed.get().clone();
        let mut rng = RNG.get_or_init(|| Mutex::new(StdRng::from_seed(seed)))
            .lock().unwrap();
        
        // 在空白位置生成2(90%)或4(10%)
        let position = self.get_random_empty_position();
        let value = if rng.gen_ratio(9, 10) { 2 } else { 4 };

        // 返回生成的位置和数值
        (position, value)
      }

      pub fn generate_new_tile(&mut self) {
        let (position, value) = self._generate_new_tile();
        
        self.board.insert(position, value);
        
        // 更新随机种子
        self.rng_seed.set(rng.gen::<[u8;32]>());
    }
    }
    \`\`\`
    `,
	].join("\n\n")
}
