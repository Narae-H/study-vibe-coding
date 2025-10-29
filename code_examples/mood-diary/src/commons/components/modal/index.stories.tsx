import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './index';

/**
 * CompleteMatrix 스토리에서 사용할 공통 스타일 객체
 */
const MATRIX_STYLES = {
  /** 컨테이너 스타일 */
  container: { display: 'flex', flexDirection: 'column' as const, gap: '24px' },
  /** Light 테마 섹션 헤딩 스타일 */
  lightHeading: { margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' },
  /** Dark 테마 배경 스타일 */
  darkSection: { padding: '24px', backgroundColor: '#1a1a1a', borderRadius: '8px' },
  /** Dark 테마 섹션 헤딩 스타일 */
  darkHeading: { margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'white' },
  /** 그리드 레이아웃 스타일 */
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' },
  /** 서브 헤딩 스타일 (Light) */
  subHeading: { margin: '0 0 8px 0', fontSize: '14px' },
  /** 서브 헤딩 스타일 (Dark) */
  subHeadingDark: { margin: '0 0 8px 0', fontSize: '14px', color: 'white' },
  /** 모달 컨테이너 스타일 */
  modalContainer: { display: 'flex', flexDirection: 'column' as const, gap: '8px' }
} as const;

/**
 * 일반 스토리에서 사용할 공통 레이아웃 스타일
 */
const LAYOUT_STYLES = {
  /** Flex 레이아웃 스타일 */
  flex: { display: 'flex', gap: '16px', flexWrap: 'wrap' as const }
} as const;

/** Storybook Meta 설정 객체 */
const meta = {
  title: 'Commons/Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Modal 컴포넌트는 Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.

## Features
- **Variant**: info, danger
- **Actions**: single, dual
- **Theme**: light, dark
- **States**: isOpen

## Specifications
- **Modal Width**: 480px (padding 포함, box-sizing: border-box 적용)
- **Modal Padding**: 24px
- **Single Button**: width 100% (432px)
- **Dual Buttons**: 각 104px, 간격 21px
- **Button Variants**: primary (오른쪽/주요), secondary (왼쪽/보조)
- **Button Size**: large (48px, Figma 일치)
- **Button Theme**: light 모드 전용

## Implementation
- ✅ Figma 노드 ID 3:1046 (single action) 기반 구현
- ✅ Figma 노드 ID 3:670 (dual actions) 기반 구현
- ✅ Button 컴포넌트 재사용 (variant, size, theme, className props)
- ✅ 스타일 일관성: Button, Input 패턴과 100% 일치

## Usage
modal.provider와 함께 사용하며, 자체 backdrop 스타일을 생성하지 않습니다.
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['info', 'danger'],
      description: '모달의 variant 타입'
    },
    actions: {
      control: { type: 'select' },
      options: ['single', 'dual'],
      description: '액션 버튼 타입'
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: '테마 모드'
    },
    title: {
      control: { type: 'text' },
      description: '모달 타이틀'
    },
    description: {
      control: { type: 'text' },
      description: '모달 설명 텍스트'
    },
    primaryButtonText: {
      control: { type: 'text' },
      description: '주요 액션 버튼 텍스트'
    },
    secondaryButtonText: {
      control: { type: 'text' },
      description: '보조 액션 버튼 텍스트 (actions="dual"일 때 필수)'
    },
    isOpen: {
      control: { type: 'boolean' },
      description: '모달이 열려있는지 여부'
    }
  },
  args: {
    variant: 'info',
    actions: 'single',
    theme: 'light',
    title: 'Modal Title',
    description: 'This is a modal description.',
    primaryButtonText: 'Confirm',
    isOpen: true
  }
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {};

// Variant 스토리들
export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    description: 'This is an informational modal.',
    primaryButtonText: 'Got it'
  }
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    title: 'Delete Item',
    description: 'Are you sure you want to delete this item? This action cannot be undone.',
    primaryButtonText: 'Delete'
  }
};

// Actions 스토리들
export const SingleAction: Story = {
  args: {
    actions: 'single',
    title: 'Single Action Modal',
    description: 'This modal has only one action button.',
    primaryButtonText: 'Confirm'
  }
};

export const DualAction: Story = {
  args: {
    actions: 'dual',
    title: 'Dual Action Modal',
    description: 'This modal has two action buttons.',
    primaryButtonText: 'Confirm',
    secondaryButtonText: 'Cancel'
  }
};

// Theme 스토리들
export const LightTheme: Story = {
  args: {
    theme: 'light',
    title: 'Light Theme Modal',
    description: 'This modal uses the light theme.',
    primaryButtonText: 'Confirm'
  },
  parameters: {
    backgrounds: { default: 'light' }
  }
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    title: 'Dark Theme Modal',
    description: 'This modal uses the dark theme.',
    primaryButtonText: 'Confirm'
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};

// Info Variant 조합들
export const InfoSingleLight: Story = {
  args: {
    variant: 'info',
    actions: 'single',
    theme: 'light',
    title: 'Welcome',
    description: 'Welcome to our application!',
    primaryButtonText: 'Get Started'
  }
};

export const InfoDualLight: Story = {
  args: {
    variant: 'info',
    actions: 'dual',
    theme: 'light',
    title: 'Save Changes',
    description: 'Do you want to save your changes?',
    primaryButtonText: 'Save',
    secondaryButtonText: 'Cancel'
  }
};

export const InfoSingleDark: Story = {
  args: {
    variant: 'info',
    actions: 'single',
    theme: 'dark',
    title: 'Welcome',
    description: 'Welcome to our application!',
    primaryButtonText: 'Get Started'
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};

export const InfoDualDark: Story = {
  args: {
    variant: 'info',
    actions: 'dual',
    theme: 'dark',
    title: 'Save Changes',
    description: 'Do you want to save your changes?',
    primaryButtonText: 'Save',
    secondaryButtonText: 'Cancel'
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};

// Danger Variant 조합들
export const DangerSingleLight: Story = {
  args: {
    variant: 'danger',
    actions: 'single',
    theme: 'light',
    title: 'Error',
    description: 'An error occurred. Please try again.',
    primaryButtonText: 'OK'
  }
};

export const DangerDualLight: Story = {
  args: {
    variant: 'danger',
    actions: 'dual',
    theme: 'light',
    title: 'Delete Account',
    description: 'Are you sure you want to delete your account? This action cannot be undone.',
    primaryButtonText: 'Delete',
    secondaryButtonText: 'Cancel'
  }
};

export const DangerSingleDark: Story = {
  args: {
    variant: 'danger',
    actions: 'single',
    theme: 'dark',
    title: 'Error',
    description: 'An error occurred. Please try again.',
    primaryButtonText: 'OK'
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};

export const DangerDualDark: Story = {
  args: {
    variant: 'danger',
    actions: 'dual',
    theme: 'dark',
    title: 'Delete Account',
    description: 'Are you sure you want to delete your account? This action cannot be undone.',
    primaryButtonText: 'Delete',
    secondaryButtonText: 'Cancel'
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};

// 모든 Variant 조합 보여주기
export const AllVariants: Story = {
  render: () => (
    <div style={LAYOUT_STYLES.flex}>
      <Modal
        variant="info"
        title="Info Modal"
        description="This is an informational modal."
        primaryButtonText="Confirm"
      />
      <Modal
        variant="danger"
        title="Danger Modal"
        description="This is a danger modal."
        primaryButtonText="Delete"
      />
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

// 모든 Actions 조합 보여주기
export const AllActions: Story = {
  render: () => (
    <div style={LAYOUT_STYLES.flex}>
      <Modal
        actions="single"
        title="Single Action"
        description="Modal with single action button."
        primaryButtonText="Confirm"
      />
      <Modal
        actions="dual"
        title="Dual Actions"
        description="Modal with dual action buttons."
        primaryButtonText="Confirm"
        secondaryButtonText="Cancel"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 actions를 한 번에 확인할 수 있습니다.'
      }
    }
  }
};

// Light Theme 모든 Variant
export const LightThemeVariants: Story = {
  render: () => (
    <div style={LAYOUT_STYLES.flex}>
      <Modal
        variant="info"
        theme="light"
        title="Info Light"
        description="Info variant in light theme."
        primaryButtonText="Confirm"
      />
      <Modal
        variant="danger"
        theme="light"
        title="Danger Light"
        description="Danger variant in light theme."
        primaryButtonText="Delete"
      />
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
    <div style={LAYOUT_STYLES.flex}>
      <Modal
        variant="info"
        theme="dark"
        title="Info Dark"
        description="Info variant in dark theme."
        primaryButtonText="Confirm"
      />
      <Modal
        variant="danger"
        theme="dark"
        title="Danger Dark"
        description="Danger variant in dark theme."
        primaryButtonText="Delete"
      />
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
    <div style={MATRIX_STYLES.container}>
      <div>
        <h3 style={MATRIX_STYLES.lightHeading}>Light Theme</h3>
        <div style={MATRIX_STYLES.grid}>
          <div>
            <h4 style={MATRIX_STYLES.subHeading}>Info</h4>
            <div style={MATRIX_STYLES.modalContainer}>
              <Modal
                variant="info"
                theme="light"
                actions="single"
                title="Info Single"
                description="Info modal with single action"
                primaryButtonText="Confirm"
              />
              <Modal
                variant="info"
                theme="light"
                actions="dual"
                title="Info Dual"
                description="Info modal with dual actions"
                primaryButtonText="Confirm"
                secondaryButtonText="Cancel"
              />
            </div>
          </div>
          <div>
            <h4 style={MATRIX_STYLES.subHeading}>Danger</h4>
            <div style={MATRIX_STYLES.modalContainer}>
              <Modal
                variant="danger"
                theme="light"
                actions="single"
                title="Danger Single"
                description="Danger modal with single action"
                primaryButtonText="Delete"
              />
              <Modal
                variant="danger"
                theme="light"
                actions="dual"
                title="Danger Dual"
                description="Danger modal with dual actions"
                primaryButtonText="Delete"
                secondaryButtonText="Cancel"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div style={MATRIX_STYLES.darkSection}>
        <h3 style={MATRIX_STYLES.darkHeading}>Dark Theme</h3>
        <div style={MATRIX_STYLES.grid}>
          <div>
            <h4 style={MATRIX_STYLES.subHeadingDark}>Info</h4>
            <div style={MATRIX_STYLES.modalContainer}>
              <Modal
                variant="info"
                theme="dark"
                actions="single"
                title="Info Single"
                description="Info modal with single action"
                primaryButtonText="Confirm"
              />
              <Modal
                variant="info"
                theme="dark"
                actions="dual"
                title="Info Dual"
                description="Info modal with dual actions"
                primaryButtonText="Confirm"
                secondaryButtonText="Cancel"
              />
            </div>
          </div>
          <div>
            <h4 style={MATRIX_STYLES.subHeadingDark}>Danger</h4>
            <div style={MATRIX_STYLES.modalContainer}>
              <Modal
                variant="danger"
                theme="dark"
                actions="single"
                title="Danger Single"
                description="Danger modal with single action"
                primaryButtonText="Delete"
              />
              <Modal
                variant="danger"
                theme="dark"
                actions="dual"
                title="Danger Dual"
                description="Danger modal with dual actions"
                primaryButtonText="Delete"
                secondaryButtonText="Cancel"
              />
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
        story: '모든 variant, actions, theme 조합을 한 번에 확인할 수 있는 완전한 매트릭스입니다.'
      }
    }
  }
};

