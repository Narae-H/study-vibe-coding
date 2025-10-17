import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Selectbox } from './index';

/** 기본 옵션 데이터 */
const defaultOptions = [
  { value: 'all', label: '전체' },
  { value: 'happy', label: '행복해요' },
  { value: 'sad', label: '슬퍼요' },
  { value: 'surprise', label: '놀랐어요' },
  { value: 'angry', label: '화나요' },
  { value: 'etc', label: '기타' },
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
- **States**: disabled, selected
- **외부 클릭 감지**: 드롭다운 외부 클릭 시 자동으로 닫힘
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
      description: 'placeholder 텍스트'
    },
    options: {
      control: { type: 'object' },
      description: '선택 가능한 옵션 목록'
    }
  },
  args: {
    options: defaultOptions,
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    disabled: false,
    placeholder: '선택하세요'
  }
} satisfies Meta<typeof Selectbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {};

// Controlled Component 예제
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Selectbox
          {...args}
          value={value}
          onChange={setValue}
        />
        <div style={{ fontSize: '14px', color: '#5f5f5f' }}>
          선택된 값: <strong>{value || '없음'}</strong>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled component로 사용하는 예제입니다. 선택된 값을 외부 state로 관리합니다.'
      }
    }
  }
};

// Variant 스토리들
export const Primary: Story = {
  args: {
    variant: 'primary',
    defaultValue: 'all'
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    defaultValue: 'happy'
  }
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    defaultValue: 'sad'
  }
};

// Size 스토리들
export const Small: Story = {
  args: {
    size: 'small',
    defaultValue: 'all'
  }
};

export const Medium: Story = {
  args: {
    size: 'medium',
    defaultValue: 'all'
  }
};

export const Large: Story = {
  args: {
    size: 'large',
    defaultValue: 'all'
  }
};

// Theme 스토리들
export const LightTheme: Story = {
  args: {
    theme: 'light',
    defaultValue: 'all'
  },
  parameters: {
    backgrounds: { default: 'light' }
  }
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    defaultValue: 'all'
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};

// 상태 스토리들
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'all'
  }
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: '감정을 선택하세요'
  }
};

// 모든 Variant 조합 보여주기
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Selectbox variant="primary" options={defaultOptions} defaultValue="all" />
      <Selectbox variant="secondary" options={defaultOptions} defaultValue="happy" />
      <Selectbox variant="tertiary" options={defaultOptions} defaultValue="sad" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 variant를 한 번에 확인할 수 있습니다.'
      }
    }
  }
};

// 모든 Size 조합 보여주기
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <Selectbox size="small" options={defaultOptions} defaultValue="all" />
      <Selectbox size="medium" options={defaultOptions} defaultValue="all" />
      <Selectbox size="large" options={defaultOptions} defaultValue="all" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 size를 한 번에 확인할 수 있습니다.'
      }
    }
  }
};

// Light Theme 모든 Variant
export const LightThemeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Selectbox variant="primary" theme="light" options={defaultOptions} defaultValue="all" />
      <Selectbox variant="secondary" theme="light" options={defaultOptions} defaultValue="happy" />
      <Selectbox variant="tertiary" theme="light" options={defaultOptions} defaultValue="sad" />
    </div>
  ),
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      description: {
        story: 'Light theme에서의 모든 variant를 확인할 수 있습니다.'
      }
    }
  }
};

// Dark Theme 모든 Variant
export const DarkThemeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Selectbox variant="primary" theme="dark" options={defaultOptions} defaultValue="all" />
      <Selectbox variant="secondary" theme="dark" options={defaultOptions} defaultValue="happy" />
      <Selectbox variant="tertiary" theme="dark" options={defaultOptions} defaultValue="sad" />
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Dark theme에서의 모든 variant를 확인할 수 있습니다.'
      }
    }
  }
};

// Disabled 상태의 모든 Variant
export const DisabledVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Selectbox variant="primary" disabled options={defaultOptions} defaultValue="all" />
      <Selectbox variant="secondary" disabled options={defaultOptions} defaultValue="happy" />
      <Selectbox variant="tertiary" disabled options={defaultOptions} defaultValue="sad" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled 상태의 모든 variant를 확인할 수 있습니다.'
      }
    }
  }
};

// 완전한 매트릭스 - 모든 조합
export const CompleteMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Light Theme</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Primary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Selectbox variant="primary" theme="light" size="small" options={defaultOptions} defaultValue="all" />
              <Selectbox variant="primary" theme="light" size="medium" options={defaultOptions} defaultValue="all" />
              <Selectbox variant="primary" theme="light" size="large" options={defaultOptions} defaultValue="all" />
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Secondary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Selectbox variant="secondary" theme="light" size="small" options={defaultOptions} defaultValue="all" />
              <Selectbox variant="secondary" theme="light" size="medium" options={defaultOptions} defaultValue="all" />
              <Selectbox variant="secondary" theme="light" size="large" options={defaultOptions} defaultValue="all" />
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Tertiary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Selectbox variant="tertiary" theme="light" size="small" options={defaultOptions} defaultValue="all" />
              <Selectbox variant="tertiary" theme="light" size="medium" options={defaultOptions} defaultValue="all" />
              <Selectbox variant="tertiary" theme="light" size="large" options={defaultOptions} defaultValue="all" />
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ padding: '24px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'white' }}>Dark Theme</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'white' }}>Primary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Selectbox variant="primary" theme="dark" size="small" options={defaultOptions} defaultValue="all" />
              <Selectbox variant="primary" theme="dark" size="medium" options={defaultOptions} defaultValue="all" />
              <Selectbox variant="primary" theme="dark" size="large" options={defaultOptions} defaultValue="all" />
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'white' }}>Secondary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Selectbox variant="secondary" theme="dark" size="small" options={defaultOptions} defaultValue="all" />
              <Selectbox variant="secondary" theme="dark" size="medium" options={defaultOptions} defaultValue="all" />
              <Selectbox variant="secondary" theme="dark" size="large" options={defaultOptions} defaultValue="all" />
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' , color: 'white' }}>Tertiary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Selectbox variant="tertiary" theme="dark" size="small" options={defaultOptions} defaultValue="all" />
              <Selectbox variant="tertiary" theme="dark" size="medium" options={defaultOptions} defaultValue="all" />
              <Selectbox variant="tertiary" theme="dark" size="large" options={defaultOptions} defaultValue="all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '모든 variant, size, theme 조합을 한 번에 확인할 수 있는 완전한 매트릭스입니다.'
      }
    }
  }
};

// 다양한 옵션 수 테스트
export const FewOptions: Story = {
  args: {
    options: [
      { value: '1', label: '옵션 1' },
      { value: '2', label: '옵션 2' },
    ]
  },
  parameters: {
    docs: {
      description: {
        story: '옵션이 적은 경우의 Selectbox입니다.'
      }
    }
  }
};

export const ManyOptions: Story = {
  args: {
    options: Array.from({ length: 20 }, (_, i) => ({
      value: `option-${i + 1}`,
      label: `옵션 ${i + 1}`
    }))
  },
  parameters: {
    docs: {
      description: {
        story: '옵션이 많은 경우의 Selectbox입니다. 리스트는 최대 높이를 가지며 스크롤이 가능합니다.'
      }
    }
  }
};

