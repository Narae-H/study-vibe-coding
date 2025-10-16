import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './index';

/** Storybook Meta 설정 객체 */
const meta = {
  title: 'Commons/Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Input 컴포넌트는 Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.

## Features
- **Variant**: primary, secondary, tertiary
- **Size**: small, medium, large  
- **Theme**: light, dark
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
      description: 'Input의 시각적 스타일 variant'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Input의 크기'
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
      description: 'Input 값'
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Input 타입'
    }
  },
  args: {
    placeholder: 'Enter text...',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    disabled: false,
    type: 'text'
  }
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {};

// Variant 스토리들
export const Primary: Story = {
  args: {
    variant: 'primary',
    placeholder: 'Primary input'
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    placeholder: 'Secondary input'
  }
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    placeholder: 'Tertiary input'
  }
};

// Size 스토리들
export const Small: Story = {
  args: {
    size: 'small',
    placeholder: 'Small input'
  }
};

export const Medium: Story = {
  args: {
    size: 'medium',
    placeholder: 'Medium input'
  }
};

export const Large: Story = {
  args: {
    size: 'large',
    placeholder: 'Large input'
  }
};

// Theme 스토리들
export const LightTheme: Story = {
  args: {
    theme: 'light',
    placeholder: 'Light theme input'
  },
  parameters: {
    backgrounds: { default: 'light' }
  }
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    placeholder: 'Dark theme input'
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};

// 상태 스토리들
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input'
  }
};

export const WithValue: Story = {
  args: {
    value: 'Input with value',
    placeholder: 'This won\'t show'
  }
};

// Input 타입별 스토리들
export const EmailInput: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email'
  }
};

export const PasswordInput: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password'
  }
};

export const NumberInput: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter a number'
  }
};

// 모든 Variant 조합 보여주기
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input variant="primary" placeholder="Primary variant" />
      <Input variant="secondary" placeholder="Secondary variant" />
      <Input variant="tertiary" placeholder="Tertiary variant" />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input size="small" placeholder="Small size" />
      <Input size="medium" placeholder="Medium size" />
      <Input size="large" placeholder="Large size" />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input variant="primary" theme="light" placeholder="Primary light" />
      <Input variant="secondary" theme="light" placeholder="Secondary light" />
      <Input variant="tertiary" theme="light" placeholder="Tertiary light" />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input variant="primary" theme="dark" placeholder="Primary dark" />
      <Input variant="secondary" theme="dark" placeholder="Secondary dark" />
      <Input variant="tertiary" theme="dark" placeholder="Tertiary dark" />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input variant="primary" disabled placeholder="Primary disabled" />
      <Input variant="secondary" disabled placeholder="Secondary disabled" />
      <Input variant="tertiary" disabled placeholder="Tertiary disabled" />
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

// 다양한 Input 타입들
export const InputTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input type="text" placeholder="Text input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="number" placeholder="Number input" />
      <Input type="tel" placeholder="Phone input" />
      <Input type="url" placeholder="URL input" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 input type을 확인할 수 있습니다.'
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
              <Input variant="primary" theme="light" size="small" placeholder="Small" />
              <Input variant="primary" theme="light" size="medium" placeholder="Medium" />
              <Input variant="primary" theme="light" size="large" placeholder="Large" />
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Secondary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Input variant="secondary" theme="light" size="small" placeholder="Small" />
              <Input variant="secondary" theme="light" size="medium" placeholder="Medium" />
              <Input variant="secondary" theme="light" size="large" placeholder="Large" />
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Tertiary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Input variant="tertiary" theme="light" size="small" placeholder="Small" />
              <Input variant="tertiary" theme="light" size="medium" placeholder="Medium" />
              <Input variant="tertiary" theme="light" size="large" placeholder="Large" />
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
              <Input variant="primary" theme="dark" size="small" placeholder="Small" />
              <Input variant="primary" theme="dark" size="medium" placeholder="Medium" />
              <Input variant="primary" theme="dark" size="large" placeholder="Large" />
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'white' }}>Secondary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Input variant="secondary" theme="dark" size="small" placeholder="Small" />
              <Input variant="secondary" theme="dark" size="medium" placeholder="Medium" />
              <Input variant="secondary" theme="dark" size="large" placeholder="Large" />
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'white' }}>Tertiary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Input variant="tertiary" theme="dark" size="small" placeholder="Small" />
              <Input variant="tertiary" theme="dark" size="medium" placeholder="Medium" />
              <Input variant="tertiary" theme="dark" size="large" placeholder="Large" />
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
