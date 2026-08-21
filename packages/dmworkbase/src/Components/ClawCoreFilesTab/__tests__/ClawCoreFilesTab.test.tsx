import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import ClawCoreFilesTab from '../ClawCoreFilesTab';
import AgentCardService from '../../../Service/AgentCardService';
import type { AgentCardData } from '../../../Service/AgentCardService';
import { I18nProvider, i18n } from '../../../i18n';

// Mock AgentCardService
vi.mock('../../../Service/AgentCardService', () => ({
  default: {
    getAgentCard: vi.fn(),
    getFileContent: vi.fn(),
    buildFileGroups: vi.fn(),
  },
}));

let container: HTMLDivElement;

const render = (ui: React.ReactElement) => {
  act(() => {
    ReactDOM.render(<I18nProvider>{ui}</I18nProvider>, container);
  });

  return {
    container,
    rerender: (nextUi: React.ReactElement) => {
      act(() => {
        ReactDOM.render(<I18nProvider>{nextUi}</I18nProvider>, container);
      });
    },
  };
};

describe('ClawCoreFilesTab', () => {
  const mockBotId = '01913a2b3c4d5e6f7890abcd_bot';

  const mockAgentCard: AgentCardData = {
    bot_id: mockBotId,
    session_total: 5,
    session_running_count: 2,
    last_report_at: '2026-05-07T10:31:00Z',
    runtime_info: {} as any,
    sessions: [],
    core_files: [
      {
        file_name: 'AGENTS.md',
        category: 'identity',
        file_size: 412,
        content_preview: '# AGENTS.md',
        last_synced_at: '2026-05-07T16:12:00Z',
      },
    ],
    memory_files: [],
  };

  const mockFileGroups = [
    {
      label: '身份与人格',
      files: [
        { name: 'AGENTS.md', path: 'AGENTS.md', size: '412B' },
      ],
    },
  ];

  beforeEach(() => {
    i18n.setLocale('zh-CN', { notify: false, persist: false });
    vi.clearAllMocks();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });
    container.remove();
    vi.restoreAllMocks();
  });

  it('应该在加载时显示 loading 状态', () => {
    vi.mocked(AgentCardService.getAgentCard).mockImplementation(
      () => new Promise(() => {}) // 永不 resolve
    );

    render(<ClawCoreFilesTab botId={mockBotId} />);

    expect(screen.getByTestId('claw-core-files-tab-loading')).toBeInTheDocument();
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('应该成功加载并显示 FileViewer', async () => {
    vi.mocked(AgentCardService.getAgentCard).mockResolvedValue(mockAgentCard);
    vi.mocked(AgentCardService.buildFileGroups).mockReturnValue(mockFileGroups);

    render(<ClawCoreFilesTab botId={mockBotId} />);

    await waitFor(() => {
      expect(screen.getByTestId('file-viewer')).toBeInTheDocument();
    });

    expect(AgentCardService.getAgentCard).toHaveBeenCalledWith(mockBotId);
    expect(AgentCardService.buildFileGroups).toHaveBeenCalledWith(mockAgentCard);
  });

  it('应该在加载失败时显示错误状态', async () => {
    vi.mocked(AgentCardService.getAgentCard).mockRejectedValue(new Error('Network error'));

    render(<ClawCoreFilesTab botId={mockBotId} />);

    await waitFor(() => {
      expect(screen.getByTestId('claw-core-files-tab-error')).toBeInTheDocument();
    });

    expect(screen.getByText('加载文件列表失败，请稍后重试')).toBeInTheDocument();
    expect(screen.getByText('重试')).toBeInTheDocument();
  });

  it('应该在点击重试按钮时重新加载', async () => {
    vi.mocked(AgentCardService.getAgentCard).mockRejectedValueOnce(new Error('Network error'));

    render(<ClawCoreFilesTab botId={mockBotId} />);

    await waitFor(() => {
      expect(screen.getByTestId('claw-core-files-tab-error')).toBeInTheDocument();
    });

    // 重新设置 mock 返回成功
    vi.mocked(AgentCardService.getAgentCard).mockResolvedValue(mockAgentCard);
    vi.mocked(AgentCardService.buildFileGroups).mockReturnValue(mockFileGroups);

    const retryButton = screen.getByText('重试');
    act(() => {
      fireEvent.click(retryButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('file-viewer')).toBeInTheDocument();
    });

    expect(AgentCardService.getAgentCard).toHaveBeenCalledTimes(2);
  });

  it('应该在文件列表为空时显示空状态', async () => {
    vi.mocked(AgentCardService.getAgentCard).mockResolvedValue({
      ...mockAgentCard,
      core_files: [],
      memory_files: [],
    });
    vi.mocked(AgentCardService.buildFileGroups).mockReturnValue([]);

    render(<ClawCoreFilesTab botId={mockBotId} />);

    await waitFor(() => {
      expect(screen.getByTestId('claw-core-files-tab-empty')).toBeInTheDocument();
    });

    expect(screen.getByText('暂无核心文件')).toBeInTheDocument();
  });

  it('应该正确传递 height 属性', () => {
    vi.mocked(AgentCardService.getAgentCard).mockImplementation(
      () => new Promise(() => {})
    );

    const { container } = render(<ClawCoreFilesTab botId={mockBotId} height="600px" />);

    const tabElement = container.querySelector('.claw-core-files-tab') as HTMLElement;
    expect(tabElement).toHaveStyle({ height: '600px' });
  });

  it('应该使用默认 height="100%" ', () => {
    vi.mocked(AgentCardService.getAgentCard).mockImplementation(
      () => new Promise(() => {})
    );

    const { container } = render(<ClawCoreFilesTab botId={mockBotId} />);

    const tabElement = container.querySelector('.claw-core-files-tab') as HTMLElement;
    expect(tabElement).toHaveStyle({ height: '100%' });
  });

  it('应该在 botId 变化时重新加载', async () => {
    vi.mocked(AgentCardService.getAgentCard).mockResolvedValue(mockAgentCard);
    vi.mocked(AgentCardService.buildFileGroups).mockReturnValue(mockFileGroups);

    const { rerender } = render(<ClawCoreFilesTab botId={mockBotId} />);

    await waitFor(() => {
      expect(screen.getByTestId('file-viewer')).toBeInTheDocument();
    });

    expect(AgentCardService.getAgentCard).toHaveBeenCalledWith(mockBotId);

    const newBotId = 'new_bot_id';
    rerender(<ClawCoreFilesTab botId={newBotId} />);

    await waitFor(() => {
      expect(AgentCardService.getAgentCard).toHaveBeenCalledWith(newBotId);
    });

    expect(AgentCardService.getAgentCard).toHaveBeenCalledTimes(2);
  });
});
