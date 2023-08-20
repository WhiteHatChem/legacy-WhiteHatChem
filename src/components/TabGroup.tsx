import { useCallback, useEffect, useState } from 'react';

interface Props {
	tabs: Array<{
		id: string,
		label: string,
		available: boolean
	}>,
	defaultActiveTab: string,
	tabsSelector: string
}

const TabGroup = ({ tabs, defaultActiveTab, tabsSelector }: Props) => {
	const [activeTab, setActiveTab] = useState(defaultActiveTab);
	const toggleTab = useCallback((id: string) => {
		document.querySelectorAll(tabsSelector).forEach((el) => el.classList.remove('active'));
		document.querySelectorAll(`${tabsSelector}#${id}`).forEach((el) => el.classList.add('active'));
		setActiveTab(id);
	}, []);
	useEffect(() => {
		toggleTab(defaultActiveTab);
	}, [defaultActiveTab]);
	return (
		<div className="flex flex-wrap flex-row gap-2">
			{tabs.map((tab) => (
				<button
          			disabled={!tab.available}
					key={tab.id}
					className={`
						disabled:opacity-50 disabled:cursor-not-allowed
						px-3 py-1 rounded-xl
						${activeTab === tab.id ? 'bg-neutral-200 dark:bg-neutral-700' : ''}
						border border-neutral-300 dark:border-neutral-600
					`}
          			onClick={() => toggleTab(tab.id)}
				>
					{tab.label}
				</button>
			))}
		</div>
	);
};

export default TabGroup; 