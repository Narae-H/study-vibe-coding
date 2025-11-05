# 2025/10/22 라이브 내용 정리: `Figma Make`

### 1. 개요
- [Figma Make](https://www.figma.com/ko-kr/make/): Figma 내에서 **AI 채팅을 통해 리액트 앱이나 웹 앱을 생성 / 구현 가능**한 기능. 
- 디자인이든 코딩이든 하나의 흐름에서 구현 가능하다는 점이 특징. 
- 템플릿 또는 디자인 파일을 기반으로 시작할 수 있음.

### 2. 주요 기능 및 특징
- 디자인이 있는 경우: 그 디자인을 입력으로 받아서 구현 → 코드 생성까지 가능함. 예를 들어 React + CSS 같은 방식으로. 
- 디자인이 없는 경우: 템플릿 또는 프롬프트 기반으로 생성 가능. 
- 코드 편집 가능: 생성된 코드에 대해 편집, 추가 기능 붙이기, 스타일 변경 등이 가능함. 
- 연결 가능성: 디자인 ↔ 코드 흐름이 짧아짐, 개발자 입장에서도 빠르게 확인 가능.

### 3. 비교: 전통적(수작업) 방식 비교 vs Figma Make 

| 구분 | 전통적(수작업) 방식 | Figma Make 방식 |
|:------|:----------------------|:----------------|
| **작업 흐름** | 디자인 → 개발자 전달 → React/TS/비즈니스 로직 구현 | 디자인 + 프롬프트 → 코드/앱 자동 생성 → 필요한 부분 수정 |
| **속도** | 비교적 느림 (수작업 중심) | 매우 빠름 (AI 자동화 기반) |
| **프로토타입 제작** | 시안 제작 및 수정에 시간 소요 | 즉시 미리보기 가능, 빠른 반복 가능 |
| **코드 품질** | 개발자 숙련도에 따라 일정 수준 유지 | 빠르지만 코드 품질이 일정치 않음, 구조 개선 필요할 수 있음 |
| **확장성** | 아키텍처 설계 자유도가 높음 | 구조적 제약 존재 (생성된 코드 기반) |
| **스타일링 자유도** | CSS, SCSS, Styled-components 등 자유롭게 선택 가능 | **Tailwind 중심** → 커스텀 스타일 제약 있음 |
| **유지보수성** | 코드 일관성 높고 팀 리뷰를 통해 품질 확보 | **AI 생성 코드 리뷰 필수**, 유지보수성은 개선 작업 필요 |
| **적합한 상황** | 정교한 로직, 복잡한 커스터마이징 필요 시 | 빠른 시제품 제작, 디자인-코드 연결 실험 시, 프로토타입 필요할 때 |
| **장점 요약** | 높은 품질, 유지보수 용이 | 구현 속도, 생산성, 반복 효율성 |
| **단점 요약** | 시간 소요 많음, 반복 작업 많음 | Tailwind 중심 스타일링, 코드 품질·유지보수 검토 필요, 유료 서비스 |

### 4. 사용자 흐름 및 활용법

#### 4-1. Figma 디자인이 있는 경우

1. IDE에서 React 프로젝트를 새로 생성  
2. Figma 디자인 링크를 복사해 붙여넣거나, 프레임을 `Ctrl + C`로 복사해 Figma Make의 AI 채팅창에 붙이기 
3. 프로젝트에 `global.css` 파일이 있다면, Figma Make의 코드 뷰에서 동일 파일을 교체(replace)  
4. 필요에 따라 `global.css`(또는 별도의 스타일 파일)을 수정하거나 추가  
5. 채팅창에 프롬프트를 입력해 코드를 개선  
   - 예: “이 화면을 리액트 컴포넌트로 만들어줘”, “Tailwind로 스타일링해줘”  
   - 생성된 코드를 검토하며 추가 프롬프트로 세부 수정도 가능  
6. 수정이 완료되면, Figma Make에서 생성된 코드를 복사해 실제 프로젝트에 붙여넣고 디버깅·테스트 후 배포

#### 4-2. 디자인이 없는 경우

1. IDE에서 React 프로젝트를 새로 생성
2. Figma Make에서 제공하는 템플릿 중 원하는 구조와 가장 유사한 것을 선택
3. 프로젝트에 `global.css` 파일이 있다면, Figma Make의 코드 뷰에서 동일 파일을 교체(replace) 
4. 프롬프트를 통해 템플릿을 자신의 요구에 맞게 수정
   - 예: 컬러, 레이아웃, 컴포넌트 구성 등  
5. 수정이 완료되면, 생성된 코드를 복사해 실제 프로젝트에 붙여넣고 디버깅·테스트 후 배포

### 5. 그 외 사용 할  수 있는 AI 디자인 툴
- [Lovable](https://lovable.dev/): Figma와 유사한 AI 웹앱 생성 툴 (디자인 → 코드 자동 변환)
- [Replit](https://replit.com/): AI 코딩 플랫폼, 디자인보단 코드 생성·수정 중심

<br/>

# 2025/10/29 라이브 내용 정리: `Supabase` 기초

## Supabase란?
- **Supabase**는 **서버리스 풀스택(Serverless Full Stack)** 개발 환경을 제공하는 플랫폼  
- 즉, **BaaS (Backend as a Service)** + **프론트엔드** 구성이 가능
- 규모가 작은 프로젝트에서는 전통적인 풀스택 대신 **서버리스 풀스택** 방식을 많이 채택 함

## 서버리스 풀스택 개발 환경 비교: Firebase vs Supabase

| 항목 | Firebase (Google) | Supabase |
|------|--------------------|-----------|
| 데이터 저장 방식 | 문서 기반 (NoSQL) | 표 기반 (SQL, PostgreSQL) |
| 확장성 | Google 생태계 내에서 유리 | **규모가 커질 경우 자체 백엔드로 이전 가능** |
| 장점 | 빠른 세팅, 구글 연동 | 오픈소스, SQL 지원, 백엔드 이전 용이 |

> 💡 **Supabase의 가장 큰 장점:**  
> 규모가 커져 **자체 백엔드를 구축해야 할 때**, 기존 데이터를 쉽게 **이전(Migration)** 가능!

## Supabase 주요 기능

- **Database (PostgreSQL)**
- **이미지 업로드 / 조회**
- **로그인 / 인증**
  - 이메일 로그인
  - 구글 로그인
  - 카카오 로그인
- **실시간 기능**
  - 실시간 DB 동기화
  - 실시간 채팅 등

## 🔒 Supabase & MCP (Model Context Protocol)

- Supabase는 **MCP**도 지원하기 때문에, 이를 통해 **Cursor** IDE에서 아래와 같은 작업이 가능
   - ex. *supabase mcp 사용해서 magazine 테이블에 어떤 컬럼이 있는지 알려줘*
- 하지만, MCP를 통해 **DB를 직접 조작**할 경우, 프로덕션 환경에서 **데이터 삭제 등 보안 문제**가 발생할 수 있음
  - 이를 방지하기 위해 **MCP Read-Only 모드**를 사용  
  - 이 옵션을 활성화하면 **조회만 가능**하도록 제한 가능

<br/>

# 2025/11/05 라이브 내용 정리: `MCP`
MCP란?
- Model Context Protocol
- AI가 사용하는 도구
- 접속형 백엔드 API 서버 ex. 피그마 접속 Supabase 접속
- 에디터 외부용

MCP 종류
1) 완전 바이브 코딩 MCP
- AI 기획
- AI 디자인
- AI 개발 
  - PRD 문서 작성
  - 레퍼런스 디자인 테마 분석
  - 타스크 리스트 작성
- ex. 테스트 마스터 MCP, Playwright MCP

2) 개발 실무 바이브 코딩 MCP
- 준비된 기획
- 준비된 피그마 디자인
- 요구사항과 똑같이 개발
- ex. 수파베이스 MCP, 피그마 MCP(Cursor-talk-tp Figma MCP, 공식 Figma MCP)

3) 업무용 MCP
- ex. 노션 MPC, 슬랙 MCP

나만의 MCP 만들기
- 참고 링크: https://modelcontextprotocol.io/docs/getting-started/intro


1) 프로젝트 생성
```bash
npm init -y
```

2) `package.json` 필요 없는거 삭제하고 아래와 같이 필요한 것만 남기기
- 현재는 테스트만 하기 위한 것으로 진짜 필요한 것만 남김
```json
{
 "type": "module"
}
```

3) MCP 디펜던시 설치
```bash
npm install @modelcontextprotocol/sdk 
```

4) root 바로 밑에 `server.js` 생성하고 아래와 같이 코드 작성
```js
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
  "get_table",      // AI가 호출할 함수 이름. 영문과 언더스코어(_)로만 작성  
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
```

5) 만든 MCP 등록
- Cursor에서 `settings`로 이동
- 왼쪽 메뉴에서 `Tools & MCP` 선택
- `New MCP Server` 선택
- 아래와 같이 추가
```json
{
  "mcpServers": {
    "TalkToFigma": {
      "command": "bunx",
      "args": [
        "cursor-talk-to-figma-mcp@latest"
      ]
    },
    "MyMCP": {
      "command": "node",
      "args": [
        "D:/vscode/personal/study-vibe-coding/mcp_server_test/server.js" // 상대경로가 아닌 절대 경로 적기
      ]
    }
  }
}
```

6) MCP 테스트
- Setttings > Tools & MCP 이동
- MyMCP를 Enable 하기
- 챗팅창에 명령
```
MyMCP 이용해서 테이블 어떤게 있나 확인해줘
```
- 그럼, MyMCP에서 get_tables를 호출하고 기존에 작성했던 결과 값을 보여줌
// 실제 테스트 해본 내용
```
결과: MyMCP에 등록된 테이블은 다음과 같습니다.
- Users
- Orders
- Products
필요하시면 특정 테이블의 스키마나 데이터 샘플도 조회해드릴게요. 어느 테이블을 볼까요?
```




-----
## 🎯 앞으로 다룰 실습 주제

1. **매거진 기능**
   - 매거진 등록
   - 매거진 조회

2. **이미지 기능**
   - 이미지 등록 및 조회
   - 썸네일 생성 (성능 최적화)

3. **구독/결제 기능**
   - 결제 및 결제 취소 기능 구현

4. **로그인 및 배포 기능**
   - 구글 로그인 연동
   - 서비스 배포
-----------
