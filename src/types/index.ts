export interface Story {
  headline: string;
  summary: string;
  sources: string[];
}

export interface Section {
  topic: string;
  stories: Story[];
}

export interface BriefingContent {
  sections: Section[];
}
