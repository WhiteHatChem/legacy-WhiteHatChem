import { useCallback, useState } from 'preact/hooks';

type TabType = 'struct' | 'interact' | 'affinity';
interface Props {
	defaultActiveTab: TabType,
	labels: Record<TabType, string>,
  availables: Record<TabType, boolean>
}

const SidebarToggleTabGroup = ({ defaultActiveTab, labels, availables }: Props) => {
	const [activeTab, setActiveTab] = useState<TabType>(defaultActiveTab);
	const toggleType = useCallback((type: TabType) => {
		document.querySelectorAll(`#similarities-tab-content>li`).forEach((el) => el.classList.remove('active'));
		document.querySelectorAll(`#similarities-tab-content>li#${type}`).forEach((el) => el.classList.add('active'));
		setActiveTab(type);
	}, []);
	return (
		<div className="similarities-tab-group flex flex-wrap flex-row gap-2">
			{(['struct', 'interact', 'affinity'] as const).map((type) => (
				<button
          disabled={!availables[type]}
					key={type}
					className={`
            disabled:opacity-50 disabled:cursor-not-allowed
            px-3 py-1 rounded-xl
            ${activeTab === type ? 'bg-neutral-200 dark:bg-neutral-700' : ''}
          `}
          onClick={() => toggleType(type)}
				>
					{labels[type]}
				</button>
			))}
		</div>
	);
};

export default SidebarToggleTabGroup;