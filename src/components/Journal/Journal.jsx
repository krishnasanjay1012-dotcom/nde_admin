import { useState } from 'react';
import CommonTabs from '../common/NDE-No-Route-Tab';
import { Box } from '@mui/material';
import JournalComponent from './JournalList';


const Journal = ({journalId}) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "Journal", value: 0 },
  ];

  return (
    <Box>
      <CommonTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mt={0}
      />

      <Box mt={1}>
        {activeTab === 0 && <JournalComponent journalId={journalId} />}
      </Box>
    </Box>
  );
};

export default Journal;