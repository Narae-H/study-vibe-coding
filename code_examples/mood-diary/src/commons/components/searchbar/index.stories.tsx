import type { Meta, StoryObj } from '@storybook/react';
import { Searchbar } from './index';

/** Storybook Meta 설정 객체 */
const meta = {
  title: 'Commons/Components/Searchbar',
  component: Searchbar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Searchbar 컴포넌트는 Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.

## Features
- **Variant**: primary, secondary, tertiary
- **Size**: small, medium, large  
- **Theme**: light, dark
- **States**: disabled, placeholder
- **Icon**: 검색 아이콘 내장

## Figma 기준 (primary-medium-light)
- 노드 ID: 3:1566
- 크기: 320×48px, borderRadius: 100px (둥근 모서리)
- 테두리: #C7C7C7, 배경: 투명
- 검색 아이콘: 24×24px
- placeholder: "검색어를 입력해 주세요.", color: #ABABAB
- font: Pretendard Variable, Medium (500), 16px, line-height: 24px
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      description: '검색바의 시각적 스타일 variant'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: '검색바의 크기'
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
    value: {
      control: { type: 'text' },
      description: '검색바 값'
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'search'],
      description: 'Input 타입'
    }
  },
  args: {
    placeholder: '검색어를 입력해 주세요.',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    disabled: false,
    type: 'text'
  }
} satisfies Meta<typeof Searchbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {};

// Variant 스토리들
export const Primary: Story = {
  args: {
    variant: 'primary',
    placeholder: 'Primary 검색바'
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    placeholder: 'Secondary 검색바'
  }
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    placeholder: 'Tertiary 검색바'
  }
};

// Size 스토리들
export const Small: Story = {
  args: {
    size: 'small',
    placeholder: 'Small 검색바'
  }
};

export const Medium: Story = {
  args: {
    size: 'medium',
    placeholder: 'Medium 검색바'
  }
};

export const Large: Story = {
  args: {
    size: 'large',
    placeholder: 'Large 검색바'
  }
};

// Theme 스토리들
export const LightTheme: Story = {
  args: {
    theme: 'light',
    placeholder: 'Light theme 검색바'
  },
  parameters: {
    backgrounds: { default: 'light' }
  }
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    placeholder: 'Dark theme 검색바'
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};

// 상태 스토리들
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled 검색바'
  }
};

export const WithValue: Story = {
  args: {
    value: '입력된 검색어',
    placeholder: 'This won\'t show'
  }
};

export const SearchType: Story = {
  args: {
    type: 'search',
    placeholder: 'Search type 검색바'
  }
};

// 모든 Variant 조합 보여주기
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      <Searchbar variant="primary" placeholder="Primary variant" />
      <Searchbar variant="secondary" placeholder="Secondary variant" />
      <Searchbar variant="tertiary" placeholder="Tertiary variant" />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      <Searchbar size="small" placeholder="Small size" />
      <Searchbar size="medium" placeholder="Medium size" />
      <Searchbar size="large" placeholder="Large size" />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      <Searchbar variant="primary" theme="light" placeholder="Primary light" />
      <Searchbar variant="secondary" theme="light" placeholder="Secondary light" />
      <Searchbar variant="tertiary" theme="light" placeholder="Tertiary light" />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      <Searchbar variant="primary" theme="dark" placeholder="Primary dark" />
      <Searchbar variant="secondary" theme="dark" placeholder="Secondary dark" />
      <Searchbar variant="tertiary" theme="dark" placeholder="Tertiary dark" />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      <Searchbar variant="primary" disabled placeholder="Primary disabled" />
      <Searchbar variant="secondary" disabled placeholder="Secondary disabled" />
      <Searchbar variant="tertiary" disabled placeholder="Tertiary disabled" />
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

// 검색 시나리오들
export const SearchScenarios: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      <Searchbar placeholder="일반 검색" />
      <Searchbar placeholder="상품 검색" value="노트북" />
      <Searchbar placeholder="사용자 검색" variant="secondary" />
      <Searchbar placeholder="고급 검색" variant="tertiary" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 검색 시나리오를 확인할 수 있습니다.'
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
              <Searchbar variant="primary" theme="light" size="small" placeholder="Small" />
              <Searchbar variant="primary" theme="light" size="medium" placeholder="Medium" />
              <Searchbar variant="primary" theme="light" size="large" placeholder="Large" />
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Secondary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Searchbar variant="secondary" theme="light" size="small" placeholder="Small" />
              <Searchbar variant="secondary" theme="light" size="medium" placeholder="Medium" />
              <Searchbar variant="secondary" theme="light" size="large" placeholder="Large" />
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Tertiary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Searchbar variant="tertiary" theme="light" size="small" placeholder="Small" />
              <Searchbar variant="tertiary" theme="light" size="medium" placeholder="Medium" />
              <Searchbar variant="tertiary" theme="light" size="large" placeholder="Large" />
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
              <Searchbar variant="primary" theme="dark" size="small" placeholder="Small" />
              <Searchbar variant="primary" theme="dark" size="medium" placeholder="Medium" />
              <Searchbar variant="primary" theme="dark" size="large" placeholder="Large" />
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'white' }}>Secondary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Searchbar variant="secondary" theme="dark" size="small" placeholder="Small" />
              <Searchbar variant="secondary" theme="dark" size="medium" placeholder="Medium" />
              <Searchbar variant="secondary" theme="dark" size="large" placeholder="Large" />
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'white' }}>Tertiary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Searchbar variant="tertiary" theme="dark" size="small" placeholder="Small" />
              <Searchbar variant="tertiary" theme="dark" size="medium" placeholder="Medium" />
              <Searchbar variant="tertiary" theme="dark" size="large" placeholder="Large" />
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
