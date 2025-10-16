import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './index';

/** Storybook Meta 설정 객체 */
const meta = {
  title: 'Commons/Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Pagination 컴포넌트는 Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.

## Features
- **Variant**: primary, secondary, tertiary
- **Size**: small, medium, large  
- **Theme**: light, dark
- **Navigation**: 이전/다음 버튼 및 페이지 번호 클릭
- **Responsive**: maxPages로 표시할 페이지 수 제한

## Figma 기준 (primary-medium-light)
- 노드 ID: 425:2243 (page nation)
- 현재 페이지: 배경 #f2f2f2, 텍스트 #000000, font-weight 500
- 일반 페이지: 투명 배경, 텍스트 #777777, font-weight 400
- 크기: 32×32px, borderRadius: 8px, fontSize: 16px
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1, max: 20 },
      description: '현재 페이지 번호 (1부터 시작)'
    },
    totalPages: {
      control: { type: 'number', min: 1, max: 20 },
      description: '전체 페이지 수'
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      description: '페이지네이션의 시각적 스타일 variant'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: '페이지네이션의 크기'
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: '테마 모드'
    },
    maxPages: {
      control: { type: 'number', min: 3, max: 10 },
      description: '최대 표시할 페이지 번호 개수 (기본값: 5)'
    }
  },
  args: {
    currentPage: 1,
    totalPages: 10,
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    maxPages: 5,
    onPageChange: (page: number) => console.log('Page changed to:', page)
  }
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive Wrapper 컴포넌트
const InteractivePagination = (args: Omit<React.ComponentProps<typeof Pagination>, 'onPageChange'>) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage);
  
  return (
    <Pagination
      {...args}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    />
  );
};

// 기본 스토리
export const Default: Story = {
  render: InteractivePagination
};

// Variant 스토리들
export const Primary: Story = {
  args: {
    variant: 'primary',
    currentPage: 3,
    totalPages: 10
  },
  render: InteractivePagination
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    currentPage: 3,
    totalPages: 10
  },
  render: InteractivePagination
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    currentPage: 3,
    totalPages: 10
  },
  render: InteractivePagination
};

// Size 스토리들
export const Small: Story = {
  args: {
    size: 'small',
    currentPage: 3,
    totalPages: 10
  },
  render: InteractivePagination
};

export const Medium: Story = {
  args: {
    size: 'medium',
    currentPage: 3,
    totalPages: 10
  },
  render: InteractivePagination
};

export const Large: Story = {
  args: {
    size: 'large',
    currentPage: 3,
    totalPages: 10
  },
  render: InteractivePagination
};

// Theme 스토리들
export const LightTheme: Story = {
  args: {
    theme: 'light',
    currentPage: 3,
    totalPages: 10
  },
  render: InteractivePagination,
  parameters: {
    backgrounds: { default: 'light' }
  }
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    currentPage: 3,
    totalPages: 10
  },
  render: InteractivePagination,
  parameters: {
    backgrounds: { default: 'dark' }
  }
};

// 페이지 수 제한 스토리들
export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 3,
    maxPages: 5
  },
  render: InteractivePagination,
  parameters: {
    docs: {
      description: {
        story: '전체 페이지 수가 적을 때의 동작을 확인할 수 있습니다.'
      }
    }
  }
};

export const ManyPages: Story = {
  args: {
    currentPage: 15,
    totalPages: 50,
    maxPages: 5
  },
  render: InteractivePagination,
  parameters: {
    docs: {
      description: {
        story: '많은 페이지가 있을 때 중간 페이지에서의 동작을 확인할 수 있습니다.'
      }
    }
  }
};

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 20,
    maxPages: 5
  },
  render: InteractivePagination,
  parameters: {
    docs: {
      description: {
        story: '첫 번째 페이지에서 이전 버튼이 비활성화되는 것을 확인할 수 있습니다.'
      }
    }
  }
};

export const LastPage: Story = {
  args: {
    currentPage: 20,
    totalPages: 20,
    maxPages: 5
  },
  render: InteractivePagination,
  parameters: {
    docs: {
      description: {
        story: '마지막 페이지에서 다음 버튼이 비활성화되는 것을 확인할 수 있습니다.'
      }
    }
  }
};

// 모든 Variant 조합 보여주기
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Primary</h4>
        <InteractivePagination variant="primary" currentPage={3} totalPages={10} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Secondary</h4>
        <InteractivePagination variant="secondary" currentPage={3} totalPages={10} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Tertiary</h4>
        <InteractivePagination variant="tertiary" currentPage={3} totalPages={10} />
      </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', textAlign: 'center' }}>Small</h4>
        <InteractivePagination size="small" currentPage={3} totalPages={10} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', textAlign: 'center' }}>Medium</h4>
        <InteractivePagination size="medium" currentPage={3} totalPages={10} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', textAlign: 'center' }}>Large</h4>
        <InteractivePagination size="large" currentPage={3} totalPages={10} />
      </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Primary Light</h4>
        <InteractivePagination variant="primary" theme="light" currentPage={3} totalPages={10} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Secondary Light</h4>
        <InteractivePagination variant="secondary" theme="light" currentPage={3} totalPages={10} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Tertiary Light</h4>
        <InteractivePagination variant="tertiary" theme="light" currentPage={3} totalPages={10} />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'white' }}>Primary Dark</h4>
        <InteractivePagination variant="primary" theme="dark" currentPage={3} totalPages={10} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'white' }}>Secondary Dark</h4>
        <InteractivePagination variant="secondary" theme="dark" currentPage={3} totalPages={10} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'white' }}>Tertiary Dark</h4>
        <InteractivePagination variant="tertiary" theme="dark" currentPage={3} totalPages={10} />
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

// 완전한 매트릭스 - 모든 조합
export const CompleteMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '600' }}>Light Theme</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginBottom: '24px' }}>
          <div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '500' }}>Primary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>Small</p>
                <InteractivePagination variant="primary" theme="light" size="small" currentPage={3} totalPages={10} />
              </div>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>Medium</p>
                <InteractivePagination variant="primary" theme="light" size="medium" currentPage={3} totalPages={10} />
              </div>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>Large</p>
                <InteractivePagination variant="primary" theme="light" size="large" currentPage={3} totalPages={10} />
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '500' }}>Secondary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>Small</p>
                <InteractivePagination variant="secondary" theme="light" size="small" currentPage={3} totalPages={10} />
              </div>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>Medium</p>
                <InteractivePagination variant="secondary" theme="light" size="medium" currentPage={3} totalPages={10} />
              </div>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>Large</p>
                <InteractivePagination variant="secondary" theme="light" size="large" currentPage={3} totalPages={10} />
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '500' }}>Tertiary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>Small</p>
                <InteractivePagination variant="tertiary" theme="light" size="small" currentPage={3} totalPages={10} />
              </div>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>Medium</p>
                <InteractivePagination variant="tertiary" theme="light" size="medium" currentPage={3} totalPages={10} />
              </div>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>Large</p>
                <InteractivePagination variant="tertiary" theme="light" size="large" currentPage={3} totalPages={10} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ padding: '32px', backgroundColor: '#1a1a1a', borderRadius: '12px' }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '600', color: 'white' }}>Dark Theme</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          <div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '500', color: 'white' }}>Primary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#ccc' }}>Small</p>
                <InteractivePagination variant="primary" theme="dark" size="small" currentPage={3} totalPages={10} />
              </div>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#ccc' }}>Medium</p>
                <InteractivePagination variant="primary" theme="dark" size="medium" currentPage={3} totalPages={10} />
              </div>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#ccc' }}>Large</p>
                <InteractivePagination variant="primary" theme="dark" size="large" currentPage={3} totalPages={10} />
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '500', color: 'white' }}>Secondary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#ccc' }}>Small</p>
                <InteractivePagination variant="secondary" theme="dark" size="small" currentPage={3} totalPages={10} />
              </div>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#ccc' }}>Medium</p>
                <InteractivePagination variant="secondary" theme="dark" size="medium" currentPage={3} totalPages={10} />
              </div>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#ccc' }}>Large</p>
                <InteractivePagination variant="secondary" theme="dark" size="large" currentPage={3} totalPages={10} />
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '500', color: 'white' }}>Tertiary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#ccc' }}>Small</p>
                <InteractivePagination variant="tertiary" theme="dark" size="small" currentPage={3} totalPages={10} />
              </div>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#ccc' }}>Medium</p>
                <InteractivePagination variant="tertiary" theme="dark" size="medium" currentPage={3} totalPages={10} />
              </div>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#ccc' }}>Large</p>
                <InteractivePagination variant="tertiary" theme="dark" size="large" currentPage={3} totalPages={10} />
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
        story: '모든 variant, size, theme 조합을 한 번에 확인할 수 있는 완전한 매트릭스입니다. 각 pagination은 상호작용이 가능합니다.'
      }
    }
  }
};

// Edge Cases 스토리들
export const EdgeCases: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Single Page</h4>
        <InteractivePagination currentPage={1} totalPages={1} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Two Pages</h4>
        <InteractivePagination currentPage={1} totalPages={2} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Max Pages = 3</h4>
        <InteractivePagination currentPage={5} totalPages={20} maxPages={3} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Max Pages = 7</h4>
        <InteractivePagination currentPage={10} totalPages={50} maxPages={7} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '특수한 상황들(단일 페이지, 적은 페이지 수, 다양한 maxPages 값)에서의 동작을 확인할 수 있습니다.'
      }
    }
  }
};
