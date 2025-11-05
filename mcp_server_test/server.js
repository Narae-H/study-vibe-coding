import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// 1. 서버 이름과 정보 입력하여 등록
const server = new McpServer({
  name: "나만의 MCP 테스트",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// 2. API를 이용하여 필요한 기능 구현
server.tool(
  "get_tables",      // AI가 호출할 함수 이름. 영문과 언더스코어(_)로만 작성  
  "테이블 데이터 조회", // 이 설명을 기반으로 AI가 get_table이라는 함수를 호출함.  만약 이 설명이 없다면 AI는 이 함수를 호출하지 않음. 따라서, 정확한 설명이 중요
  { // 매개변수 정의
  },
  () => { // 결과 값 정의
    
    // API 연결

    // 데이터 가공
    
    return {
      content: [
        {
          type: "text", // AI 한테 전달할 때 형식 정의. 아래와 같이 문구를 전달할 것이므로 text로 정의
          text: "Users, Orders, Products 테이블이 있습니다." // AI에게 전달할 결과
        },
      ],
    };
  }
)

// 3. 서버 실행
const transport = new StdioServerTransport();
server.connect(transport);