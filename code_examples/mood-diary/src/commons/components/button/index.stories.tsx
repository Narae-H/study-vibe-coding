import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';

/**
 * 아이콘 컴포넌트들 - public/icons 경로의 아이콘 사용
 * 03-ui.mdc 룰에 따라 [상수경로] [아이콘]: public/icons/* 활용
 */
const ICONS = {
  /** Plus 아이콘 컴포넌트 */
  plus: () => (
    <img src="/icons/plus_outline_light_m.svg" alt="plus" width="16" height="16" />
  ),
  /** Search 아이콘 컴포넌트 */
  search: () => (
    <img src="/icons/search_outline_light_m.svg" alt="search" width="16" height="16" />
  )
} as const;

/** Storybook Meta 설정 객체 */
const meta = {
  title: 'Commons/Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Button 컴포넌트는 Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.

## Features
- **Variant**: primary, secondary, tertiary
- **Size**: small, medium, large  
- **Theme**: light, dark
- **Icon**: 아이콘 지원 (left/right 위치)
- **States**: disabled, fullWidth
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      description: '버튼의 시각적 스타일 variant'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: '버튼의 크기'
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
    fullWidth: {
      control: { type: 'boolean' },
      description: '전체 너비 사용 여부'
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['left', 'right'],
      description: '아이콘 위치'
    },
    children: {
      control: { type: 'text' },
      description: '버튼 내용'
    }
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    disabled: false,
    fullWidth: false,
    iconPosition: 'left'
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {};

// Variant 스토리들
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button'
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button'
  }
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    children: 'Tertiary Button'
  }
};

// Size 스토리들
export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small Button'
  }
};

export const Medium: Story = {
  args: {
    size: 'medium',
    children: 'Medium Button'
  }
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large Button'
  }
};

// Theme 스토리들
export const LightTheme: Story = {
  args: {
    theme: 'light',
    children: 'Light Theme'
  },
  parameters: {
    backgrounds: { default: 'light' }
  }
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    children: 'Dark Theme'
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};

// 아이콘 스토리들
export const WithLeftIcon: Story = {
  args: {
    icon: <ICONS.plus />,
    iconPosition: 'left',
    children: 'Add Item'
  }
};

export const WithRightIcon: Story = {
  args: {
    icon: <ICONS.search />,
    iconPosition: 'right',
    children: 'Search'
  }
};

// 상태 스토리들
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button'
  }
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button'
  },
  parameters: {
    layout: 'padded'
  }
};

// 모든 Variant 조합 보여주기
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
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
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
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
      <Button variant="primary" theme="light">Primary Light</Button>
      <Button variant="secondary" theme="light">Secondary Light</Button>
      <Button variant="tertiary" theme="light">Tertiary Light</Button>
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
      <Button variant="primary" theme="dark">Primary Dark</Button>
      <Button variant="secondary" theme="dark">Secondary Dark</Button>
      <Button variant="tertiary" theme="dark">Tertiary Dark</Button>
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

// 아이콘과 함께하는 모든 Variant
export const IconVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="primary" icon={<ICONS.plus />}>Add Primary</Button>
      <Button variant="secondary" icon={<ICONS.search />}>Search Secondary</Button>
      <Button variant="tertiary" icon={<ICONS.plus />} iconPosition="right">Add Tertiary</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '아이콘이 포함된 모든 variant를 확인할 수 있습니다.'
      }
    }
  }
};

// Disabled 상태의 모든 Variant
export const DisabledVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="primary" disabled>Primary Disabled</Button>
      <Button variant="secondary" disabled>Secondary Disabled</Button>
      <Button variant="tertiary" disabled>Tertiary Disabled</Button>
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
              <Button variant="primary" theme="light" size="small">Small</Button>
              <Button variant="primary" theme="light" size="medium">Medium</Button>
              <Button variant="primary" theme="light" size="large">Large</Button>
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Secondary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button variant="secondary" theme="light" size="small">Small</Button>
              <Button variant="secondary" theme="light" size="medium">Medium</Button>
              <Button variant="secondary" theme="light" size="large">Large</Button>
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Tertiary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button variant="tertiary" theme="light" size="small">Small</Button>
              <Button variant="tertiary" theme="light" size="medium">Medium</Button>
              <Button variant="tertiary" theme="light" size="large">Large</Button>
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
              <Button variant="primary" theme="dark" size="small">Small</Button>
              <Button variant="primary" theme="dark" size="medium">Medium</Button>
              <Button variant="primary" theme="dark" size="large">Large</Button>
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'white' }}>Secondary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button variant="secondary" theme="dark" size="small">Small</Button>
              <Button variant="secondary" theme="dark" size="medium">Medium</Button>
              <Button variant="secondary" theme="dark" size="large">Large</Button>
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'white' }}>Tertiary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button variant="tertiary" theme="dark" size="small">Small</Button>
              <Button variant="tertiary" theme="dark" size="medium">Medium</Button>
              <Button variant="tertiary" theme="dark" size="large">Large</Button>
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
