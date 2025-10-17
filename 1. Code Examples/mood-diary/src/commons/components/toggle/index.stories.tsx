import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './index';

/** Storybook Meta 설정 객체 */
const meta = {
  title: 'Commons/Components/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Toggle 컴포넌트는 Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.

## Features
- **Variant**: primary, secondary, tertiary
- **Size**: small, medium, large  
- **Theme**: light, dark
- **States**: checked, disabled
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      description: '토글의 시각적 스타일 variant'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: '토글의 크기'
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: '테마 모드'
    },
    checked: {
      control: { type: 'boolean' },
      description: '체크 상태 (undefined일 경우 uncontrolled 모드로 작동)'
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태'
    },
    onChange: {
      action: 'changed',
      description: '체크 상태 변경 핸들러'
    }
  },
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    disabled: false
  }
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {};

// Variant 스토리들
export const Primary: Story = {
  args: {
    variant: 'primary'
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary'
  }
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary'
  }
};

// Size 스토리들
export const Small: Story = {
  args: {
    size: 'small'
  }
};

export const Medium: Story = {
  args: {
    size: 'medium'
  }
};

export const Large: Story = {
  args: {
    size: 'large'
  }
};

// Theme 스토리들
export const LightTheme: Story = {
  args: {
    theme: 'light'
  },
  parameters: {
    backgrounds: { default: 'light' }
  }
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark'
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};

// 상태 스토리들
export const Checked: Story = {
  args: {
    checked: true
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const CheckedDisabled: Story = {
  args: {
    checked: true,
    disabled: true
  }
};

// 모든 Variant 조합 보여주기
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>Primary</span>
        <Toggle variant="primary" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>Secondary</span>
        <Toggle variant="secondary" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>Tertiary</span>
        <Toggle variant="tertiary" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 variant를 한 번에 확인할 수 있습니다. (클릭하여 토글 가능)'
      }
    }
  }
};

// 모든 Size 조합 보여주기
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>Small</span>
        <Toggle size="small" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>Medium</span>
        <Toggle size="medium" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>Large</span>
        <Toggle size="large" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 size를 한 번에 확인할 수 있습니다. (클릭하여 토글 가능)'
      }
    }
  }
};

// Light Theme 모든 Variant
export const LightThemeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>Primary Light</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Toggle variant="primary" theme="light" checked={false} />
          <Toggle variant="primary" theme="light" checked={true} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>Secondary Light</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Toggle variant="secondary" theme="light" checked={false} />
          <Toggle variant="secondary" theme="light" checked={true} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>Tertiary Light</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Toggle variant="tertiary" theme="light" checked={false} />
          <Toggle variant="tertiary" theme="light" checked={true} />
        </div>
      </div>
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
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>Primary Dark</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Toggle variant="primary" theme="dark" checked={false} />
          <Toggle variant="primary" theme="dark" checked={true} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>Secondary Dark</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Toggle variant="secondary" theme="dark" checked={false} />
          <Toggle variant="secondary" theme="dark" checked={true} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>Tertiary Dark</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Toggle variant="tertiary" theme="dark" checked={false} />
          <Toggle variant="tertiary" theme="dark" checked={true} />
        </div>
      </div>
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
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>Primary Disabled</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Toggle variant="primary" disabled checked={false} />
          <Toggle variant="primary" disabled checked={true} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>Secondary Disabled</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Toggle variant="secondary" disabled checked={false} />
          <Toggle variant="secondary" disabled checked={true} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>Tertiary Disabled</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Toggle variant="tertiary" disabled checked={false} />
          <Toggle variant="tertiary" disabled checked={true} />
        </div>
      </div>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '16px' }}>
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>Primary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle variant="primary" theme="light" size="small" />
                <span style={{ fontSize: '12px' }}>Small</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle variant="primary" theme="light" size="medium" />
                <span style={{ fontSize: '12px' }}>Medium</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle variant="primary" theme="light" size="large" />
                <span style={{ fontSize: '12px' }}>Large</span>
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>Secondary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle variant="secondary" theme="light" size="small" />
                <span style={{ fontSize: '12px' }}>Small</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle variant="secondary" theme="light" size="medium" />
                <span style={{ fontSize: '12px' }}>Medium</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle variant="secondary" theme="light" size="large" />
                <span style={{ fontSize: '12px' }}>Large</span>
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>Tertiary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle variant="tertiary" theme="light" size="small" />
                <span style={{ fontSize: '12px' }}>Small</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle variant="tertiary" theme="light" size="medium" />
                <span style={{ fontSize: '12px' }}>Medium</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle variant="tertiary" theme="light" size="large" />
                <span style={{ fontSize: '12px' }}>Large</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ padding: '24px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'white' }}>Dark Theme</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'white' }}>Primary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle variant="primary" theme="dark" size="small" />
                <span style={{ fontSize: '12px', color: 'white' }}>Small</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle variant="primary" theme="dark" size="medium" />
                <span style={{ fontSize: '12px', color: 'white' }}>Medium</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle variant="primary" theme="dark" size="large" />
                <span style={{ fontSize: '12px', color: 'white' }}>Large</span>
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'white' }}>Secondary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle variant="secondary" theme="dark" size="small" />
                <span style={{ fontSize: '12px', color: 'white' }}>Small</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle variant="secondary" theme="dark" size="medium" />
                <span style={{ fontSize: '12px', color: 'white' }}>Medium</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle variant="secondary" theme="dark" size="large" />
                <span style={{ fontSize: '12px', color: 'white' }}>Large</span>
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'white' }}>Tertiary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle variant="tertiary" theme="dark" size="small" />
                <span style={{ fontSize: '12px', color: 'white' }}>Small</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle variant="tertiary" theme="dark" size="medium" />
                <span style={{ fontSize: '12px', color: 'white' }}>Medium</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Toggle variant="tertiary" theme="dark" size="large" />
                <span style={{ fontSize: '12px', color: 'white' }}>Large</span>
              </div>
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
        story: '모든 variant, size, theme 조합을 한 번에 확인할 수 있는 완전한 매트릭스입니다. (클릭하여 토글 가능)'
      }
    }
  }
};

// Interactive 스토리 - 상태 변경 테스트
export const Interactive: Story = {
  render: () => {
    const [checked1, setChecked1] = React.useState(false);
    const [checked2, setChecked2] = React.useState(true);
    const [checked3, setChecked3] = React.useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Toggle 
            variant="primary" 
            checked={checked1} 
            onChange={setChecked1} 
          />
          <span>Primary Toggle (상태: {checked1 ? 'ON' : 'OFF'})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Toggle 
            variant="secondary" 
            checked={checked2} 
            onChange={setChecked2} 
          />
          <span>Secondary Toggle (상태: {checked2 ? 'ON' : 'OFF'})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Toggle 
            variant="tertiary" 
            checked={checked3} 
            onChange={setChecked3} 
          />
          <span>Tertiary Toggle (상태: {checked3 ? 'ON' : 'OFF'})</span>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '실제로 상태를 변경해볼 수 있는 인터랙티브 토글들입니다.'
      }
    }
  }
};
