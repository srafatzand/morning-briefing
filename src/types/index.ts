export interface Story {
  headline: string;
  summary: string;
  sources: string[];
  imageUrl?: string;
}

export interface Section {
  topic: string;
  context?: string;
  stories: Story[];
}

export interface BriefingContent {
  sections: Section[];
}
