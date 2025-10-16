import type { Meta, StoryObj } from '@storybook/react';
import { Selectbox } from './index';

/** 테스트용 옵션 데이터 */
const SAMPLE_OPTIONS = [
  { value: 'option1', label: '옵션 1' },
  { value: 'option2', label: '옵션 2' },
  { value: 'option3', label: '옵션 3' },
  { value: 'option4', label: '옵션 4' },
];

/** 카테고리별 옵션 데이터 */
const CATEGORY_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'work', label: '업무' },
  { value: 'personal', label: '개인' },
  { value: 'study', label: '학습' },
];

/** 감정 옵션 데이터 */
const EMOTION_OPTIONS = [
  { value: 'happy', label: '😊 행복' },
  { value: 'sad', label: '😢 슬픔' },
  { value: 'angry', label: '😠 화남' },
  { value: 'surprise', label: '😲 놀람' },
  { value: 'etc', label: '🤔 기타' },
];

/** Storybook Meta 설정 객체 */
const meta = {
  title: 'Commons/Components/Selectbox',
  component: Selectbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Selectbox 컴포넌트는 Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.

## Features
- **Variant**: primary, secondary, tertiary
- **Size**: small, medium, large  
- **Theme**: light, dark
- **Options**: 동적 옵션 목록 지원
- **States**: disabled, placeholder
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Selectbox의 시각적 스타일 variant'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Selectbox의 크기'
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: '테마 모드'
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태'
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder 텍스트'
    },
    options: {
      control: { type: 'object' },
      description: '선택 가능한 옵션 목록'
    }
  },
} satisfies Meta<typeof Selectbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 Selectbox */
export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: '선택하세요',
    options: SAMPLE_OPTIONS,
  },
};

/** Primary Variant 모든 조합 */
export const PrimaryVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Light Theme */}
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Primary - Light Theme</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Selectbox variant="primary" size="small" theme="light" placeholder="Small" options={SAMPLE_OPTIONS} />
          <Selectbox variant="primary" size="medium" theme="light" placeholder="Medium" options={SAMPLE_OPTIONS} />
          <Selectbox variant="primary" size="large" theme="light" placeholder="Large" options={SAMPLE_OPTIONS} />
        </div>
      </div>
      
      {/* Dark Theme */}
      <div style={{ padding: '20px', backgroundColor: '#1c1c1c', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>Primary - Dark Theme</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Selectbox variant="primary" size="small" theme="dark" placeholder="Small" options={SAMPLE_OPTIONS} />
          <Selectbox variant="primary" size="medium" theme="dark" placeholder="Medium" options={SAMPLE_OPTIONS} />
          <Selectbox variant="primary" size="large" theme="dark" placeholder="Large" options={SAMPLE_OPTIONS} />
        </div>
      </div>
    </div>
  ),
};

/** Secondary Variant 모든 조합 */
export const SecondaryVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Light Theme */}
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Secondary - Light Theme</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Selectbox variant="secondary" size="small" theme="light" placeholder="Small" options={SAMPLE_OPTIONS} />
          <Selectbox variant="secondary" size="medium" theme="light" placeholder="Medium" options={SAMPLE_OPTIONS} />
          <Selectbox variant="secondary" size="large" theme="light" placeholder="Large" options={SAMPLE_OPTIONS} />
        </div>
      </div>
      
      {/* Dark Theme */}
      <div style={{ padding: '20px', backgroundColor: '#1c1c1c', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>Secondary - Dark Theme</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Selectbox variant="secondary" size="small" theme="dark" placeholder="Small" options={SAMPLE_OPTIONS} />
          <Selectbox variant="secondary" size="medium" theme="dark" placeholder="Medium" options={SAMPLE_OPTIONS} />
          <Selectbox variant="secondary" size="large" theme="dark" placeholder="Large" options={SAMPLE_OPTIONS} />
        </div>
      </div>
    </div>
  ),
};

/** Tertiary Variant 모든 조합 */
export const TertiaryVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Light Theme */}
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Tertiary - Light Theme</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Selectbox variant="tertiary" size="small" theme="light" placeholder="Small" options={SAMPLE_OPTIONS} />
          <Selectbox variant="tertiary" size="medium" theme="light" placeholder="Medium" options={SAMPLE_OPTIONS} />
          <Selectbox variant="tertiary" size="large" theme="light" placeholder="Large" options={SAMPLE_OPTIONS} />
        </div>
      </div>
      
      {/* Dark Theme */}
      <div style={{ padding: '20px', backgroundColor: '#1c1c1c', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>Tertiary - Dark Theme</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Selectbox variant="tertiary" size="small" theme="dark" placeholder="Small" options={SAMPLE_OPTIONS} />
          <Selectbox variant="tertiary" size="medium" theme="dark" placeholder="Medium" options={SAMPLE_OPTIONS} />
          <Selectbox variant="tertiary" size="large" theme="dark" placeholder="Large" options={SAMPLE_OPTIONS} />
        </div>
      </div>
    </div>
  ),
};

/** 모든 Variant 비교 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Light Theme */}
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>All Variants - Light Theme (Medium Size)</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Selectbox variant="primary" size="medium" theme="light" placeholder="Primary" options={SAMPLE_OPTIONS} />
          <Selectbox variant="secondary" size="medium" theme="light" placeholder="Secondary" options={SAMPLE_OPTIONS} />
          <Selectbox variant="tertiary" size="medium" theme="light" placeholder="Tertiary" options={SAMPLE_OPTIONS} />
        </div>
      </div>
      
      {/* Dark Theme */}
      <div style={{ padding: '20px', backgroundColor: '#1c1c1c', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>All Variants - Dark Theme (Medium Size)</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Selectbox variant="primary" size="medium" theme="dark" placeholder="Primary" options={SAMPLE_OPTIONS} />
          <Selectbox variant="secondary" size="medium" theme="dark" placeholder="Secondary" options={SAMPLE_OPTIONS} />
          <Selectbox variant="tertiary" size="medium" theme="dark" placeholder="Tertiary" options={SAMPLE_OPTIONS} />
        </div>
      </div>
    </div>
  ),
};

/** 크기별 비교 */
export const SizeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Size Comparison (Primary Light)</h3>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Selectbox variant="primary" size="small" theme="light" placeholder="Small" options={SAMPLE_OPTIONS} />
          <span style={{ fontSize: '12px', color: '#666' }}>Small (100px × 36px)</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Selectbox variant="primary" size="medium" theme="light" placeholder="Medium" options={SAMPLE_OPTIONS} />
          <span style={{ fontSize: '12px', color: '#666' }}>Medium (120px × 48px)</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Selectbox variant="primary" size="large" theme="light" placeholder="Large" options={SAMPLE_OPTIONS} />
          <span style={{ fontSize: '12px', color: '#666' }}>Large (160px × 56px)</span>
        </div>
      </div>
    </div>
  ),
};

/** 비활성화 상태 */
export const DisabledState: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Disabled State</h3>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Selectbox variant="primary" size="medium" theme="light" placeholder="Disabled Primary" options={SAMPLE_OPTIONS} disabled />
        <Selectbox variant="secondary" size="medium" theme="light" placeholder="Disabled Secondary" options={SAMPLE_OPTIONS} disabled />
        <Selectbox variant="tertiary" size="medium" theme="light" placeholder="Disabled Tertiary" options={SAMPLE_OPTIONS} disabled />
      </div>
    </div>
  ),
};

/** 실제 사용 예시 - 카테고리 선택 */
export const CategoryExample: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '600' }}>카테고리 선택 예시</h3>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', minWidth: '60px' }}>카테고리:</label>
        <Selectbox 
          variant="primary" 
          size="medium" 
          theme="light" 
          placeholder="전체" 
          options={CATEGORY_OPTIONS}
          defaultValue="all"
        />
      </div>
    </div>
  ),
};

/** 실제 사용 예시 - 감정 선택 */
export const EmotionExample: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '600' }}>감정 선택 예시</h3>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', minWidth: '60px' }}>감정:</label>
        <Selectbox 
          variant="secondary" 
          size="medium" 
          theme="light" 
          placeholder="감정을 선택하세요" 
          options={EMOTION_OPTIONS}
        />
      </div>
    </div>
  ),
};

/** 폼 레이아웃 예시 */
export const FormLayoutExample: Story = {
  render: () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px',
      padding: '24px',
      border: '1px solid #e4e4e4',
      borderRadius: '12px',
      backgroundColor: '#fafafa',
      maxWidth: '400px'
    }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>일기 필터</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>기간</label>
        <Selectbox 
          variant="primary" 
          size="medium" 
          theme="light" 
          placeholder="기간 선택" 
          options={[
            { value: 'today', label: '오늘' },
            { value: 'week', label: '이번 주' },
            { value: 'month', label: '이번 달' },
            { value: 'year', label: '올해' },
          ]}
        />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>카테고리</label>
        <Selectbox 
          variant="primary" 
          size="medium" 
          theme="light" 
          placeholder="카테고리 선택" 
          options={CATEGORY_OPTIONS}
        />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>감정</label>
        <Selectbox 
          variant="primary" 
          size="medium" 
          theme="light" 
          placeholder="감정 선택" 
          options={EMOTION_OPTIONS}
        />
      </div>
    </div>
  ),
};

/** 인터랙티브 플레이그라운드 */
export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: '옵션을 선택하세요',
    options: SAMPLE_OPTIONS,
    disabled: false,
  },
};
