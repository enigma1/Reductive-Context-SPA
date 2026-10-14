import { useState } from 'react';
import { Conversation } from '>/contracts';
import { parseBundleFiles, toLocalTime } from '>/services/utils';
import { ConversationCard } from './ConversationCard';

type ConversationEntriesProps = {
  conversations: Conversation[];
  bundleId: number;
};

export const ConversationEntries = ({
  conversations,
  bundleId,
}: ConversationEntriesProps) => {
  return (
    <div className='space-y-2'>
      {conversations.map((entry, idx) => {
        return (
          <ConversationCard
            key={`${entry.createdAt}-${bundleId}-${idx}`}
            entry={entry}
          />
        );
      })}
    </div>
  );
};
