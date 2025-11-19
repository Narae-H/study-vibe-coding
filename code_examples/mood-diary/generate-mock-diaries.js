/**
 * 일기 Mock 데이터 생성 스크립트
 * 
 * 브라우저 콘솔에서 실행하여 로컬스토리지에 테스트용 일기 데이터를 생성합니다.
 * 
 * 사용법:
 * 1. 브라우저 개발자 도구 열기 (F12)
 * 2. Console 탭 선택
 * 3. 아래 스크립트 전체를 복사하여 붙여넣기
 * 4. Enter 키를 눌러 실행
 * 5. 페이지 새로고침 (F5)
 */

(function() {
  // 감정 타입 정의
  const emotions = ['HAPPY', 'SAD', 'ANGRY', 'SURPRISE', 'ETC'];
  
  // 제목 예시 데이터
  const titleTemplates = [
    '오늘은 정말 좋은 하루였어요',
    '친구들과 즐거운 시간을 보냈어요',
    '새로운 것을 배운 날',
    '힘든 하루였지만 버텨냈어요',
    '가족과 함께한 특별한 순간',
    '직장에서 있었던 일',
    '맛있는 음식을 먹은 날',
    '운동하고 온 날',
    '책을 읽으며 보낸 하루',
    '영화를 보고 느낀 점',
    '날씨가 좋았던 하루',
    '여행 계획을 세운 날',
    '오랜만에 친구를 만났어요',
    '새로운 취미를 시작했어요',
    '집에서 쉬는 날',
    '중요한 결정을 내린 날',
    '감사한 일이 있었던 하루',
    '도전해본 새로운 일',
    '예상치 못한 일이 생긴 날',
    '평온한 일상',
    '스트레스 받은 하루',
    '성취감을 느낀 날',
    '반성하게 된 하루',
    '희망찬 하루',
    '아쉬움이 남는 날',
    '즐거운 주말',
    '바쁜 평일',
    '여유로운 오후',
    '기억에 남을 순간',
    '평범하지만 소중한 하루'
  ];
  
  // 내용 예시 데이터
  const contentTemplates = [
    '오늘은 아침 일찍 일어나서 상쾌한 하루를 시작했습니다. 날씨도 좋고 기분도 좋아서 하루 종일 행복했어요.',
    '친구들과 카페에서 만나 이야기를 나누었습니다. 오랜만에 웃으면서 즐거운 시간을 보낼 수 있어서 좋았어요.',
    '새로운 프로젝트를 시작했습니다. 조금 불안하기도 하지만 동시에 설레는 마음도 있어요.',
    '오늘은 힘든 일들이 있었지만, 그래도 긍정적으로 생각하려고 노력했습니다.',
    '가족들과 함께 저녁 식사를 하면서 많은 이야기를 나눴어요. 가족의 소중함을 다시 한번 느꼈습니다.',
    '직장에서 좋은 평가를 받았습니다. 그동안의 노력이 인정받는 것 같아서 뿌듯해요.',
    '새로 개업한 맛집에 가서 맛있는 음식을 먹었습니다. 분위기도 좋고 음식도 맛있어서 만족스러웠어요.',
    '오랜만에 운동을 했더니 몸은 힘들지만 기분은 상쾌합니다. 앞으로도 꾸준히 운동해야겠어요.',
    '책을 읽으면서 많은 생각을 했습니다. 작가의 생각에 공감하는 부분도 많고 새로운 관점도 얻었어요.',
    '영화를 보고 왔는데 생각보다 훨씬 재미있었어요. 오랜만에 영화관에 가서 좋았습니다.',
    '날씨가 너무 좋아서 공원을 산책했습니다. 자연을 느끼면서 걷는 시간이 힐링이 되었어요.',
    '여름 휴가 계획을 세웠습니다. 어디로 갈지 생각하는 것만으로도 설레네요.',
    '오랜만에 고등학교 친구를 만났어요. 옛날 이야기를 하며 추억에 잠겼습니다.',
    '새로운 취미로 그림 그리기를 시작했어요. 서툴지만 재미있어서 계속 해보고 싶습니다.',
    '오늘은 집에서 푹 쉬었어요. 아무것도 하지 않는 여유로운 시간이 필요했습니다.',
    '중요한 선택의 순간이 있었어요. 많이 고민했지만 결국 내 마음을 따라 결정했습니다.',
    '작은 일이지만 누군가에게 도움을 받았어요. 감사한 마음이 듭니다.',
    '처음 해보는 일에 도전했어요. 결과가 어떻게 나올지 모르지만 도전했다는 것 자체가 의미있어요.',
    '예상치 못한 일이 생겨서 당황했지만, 잘 해결되어서 다행이에요.',
    '평범한 하루였지만 그 평범함이 소중하게 느껴지는 날입니다.',
    '스트레스를 많이 받았지만, 내일은 더 나아질 거라고 생각합니다.',
    '목표했던 일을 완수해서 뿌듯합니다. 노력한 보람이 있어요.',
    '오늘의 내 행동을 반성하게 되었어요. 앞으로는 더 신중하게 행동해야겠습니다.',
    '좋은 소식을 들어서 하루 종일 기분이 좋았어요. 희망찬 내일이 기대됩니다.',
    '아쉬운 일이 있었지만, 다음에는 더 잘할 수 있을 거예요.',
    '주말을 맞이해서 여유롭게 보냈습니다. 평일의 피로가 풀리는 것 같아요.',
    '오늘은 정말 바빴지만 알차게 보낸 하루였습니다.',
    '오후 시간을 여유롭게 보내며 나를 돌아봤어요.',
    '오늘 있었던 일은 오래 기억에 남을 것 같습니다.',
    '특별한 일은 없었지만 그래도 행복한 하루였어요.'
  ];
  
  /**
   * 날짜를 YYYY-MM-DD 형식으로 포맷
   */
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  /**
   * 랜덤 날짜 생성 (최근 60일 이내)
   */
  function getRandomDate() {
    const today = new Date();
    const daysAgo = Math.floor(Math.random() * 60); // 0-59일 전
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    return date;
  }
  
  /**
   * Mock 일기 데이터 생성
   * @param {number} count - 생성할 일기 개수
   */
  function generateMockDiaries(count = 30) {
    const diaries = [];
    
    for (let i = 1; i <= count; i++) {
      // 랜덤 감정 선택
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      
      // 랜덤 제목과 내용 선택
      const titleIndex = Math.floor(Math.random() * titleTemplates.length);
      const contentIndex = Math.floor(Math.random() * contentTemplates.length);
      
      // 랜덤 날짜 생성
      const date = getRandomDate();
      
      const diary = {
        id: i,
        title: titleTemplates[titleIndex],
        content: contentTemplates[contentIndex],
        emotion: emotion,
        createdAt: date.toISOString()
      };
      
      diaries.push(diary);
    }
    
    // 날짜 기준으로 내림차순 정렬 (최신순)
    diaries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // id 재할당 (정렬 후)
    diaries.forEach((diary, index) => {
      diary.id = index + 1;
    });
    
    return diaries;
  }
  
  /**
   * 로컬스토리지에 일기 데이터 저장
   */
  function saveDiariesToLocalStorage(diaries) {
    try {
      localStorage.setItem('diaries', JSON.stringify(diaries));
      console.log(`✅ ${diaries.length}개의 일기 데이터가 생성되었습니다!`);
      console.log('📊 생성된 데이터 미리보기:');
      console.table(diaries.slice(0, 5).map(d => ({
        id: d.id,
        title: d.title,
        emotion: d.emotion,
        date: formatDate(new Date(d.createdAt))
      })));
      console.log('💡 페이지를 새로고침(F5)하면 생성된 일기를 확인할 수 있습니다.');
      
      // 이벤트 발생시켜 자동 새로고침
      window.dispatchEvent(new CustomEvent('diaries-updated'));
    } catch (error) {
      console.error('❌ 데이터 저장 중 오류 발생:', error);
    }
  }
  
  /**
   * 기존 데이터 삭제
   */
  function clearDiaries() {
    localStorage.removeItem('diaries');
    console.log('🗑️ 기존 일기 데이터가 삭제되었습니다.');
    window.dispatchEvent(new CustomEvent('diaries-updated'));
  }
  
  // 전역 함수로 등록
  window.generateMockDiaries = function(count = 30) {
    const diaries = generateMockDiaries(count);
    saveDiariesToLocalStorage(diaries);
  };
  
  window.clearDiaries = clearDiaries;
  
  window.showDiaries = function() {
    try {
      const diaries = JSON.parse(localStorage.getItem('diaries') || '[]');
      console.log(`📚 현재 저장된 일기: ${diaries.length}개`);
      console.table(diaries.map(d => ({
        id: d.id,
        title: d.title,
        emotion: d.emotion,
        date: formatDate(new Date(d.createdAt))
      })));
    } catch (error) {
      console.error('❌ 데이터 읽기 중 오류 발생:', error);
    }
  };
  
  // 스크립트 로드 메시지
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 일기 Mock 데이터 생성 스크립트 로드됨');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('사용 가능한 명령어:');
  console.log('  • generateMockDiaries(30)  - 30개의 일기 생성 (기본값: 30)');
  console.log('  • generateMockDiaries(50)  - 50개의 일기 생성');
  console.log('  • showDiaries()            - 현재 저장된 일기 조회');
  console.log('  • clearDiaries()           - 모든 일기 삭제');
  console.log('');
  console.log('💡 빠른 시작: generateMockDiaries() 실행');
  console.log('');
  
  // 자동 실행 (선택사항)
  // 자동으로 30개 생성하려면 아래 주석 해제
  // generateMockDiaries(30);
})();

