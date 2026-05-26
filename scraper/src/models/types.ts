export interface PersonalInfo {
  fighter_id: string;
  platform_id: number;
  short_id: number;
  platform_name: string;
  platform_tool_name: string;
}

export interface LeagueInfo {
  league_point: number;
  league_rank: number;
  master_league: number;
  master_rating: number;
  master_rating_ranking: number;
}

export interface PlayPoint {
  battle_hub: number;
  fighting_ground: number;
  world_tour: number;
}

export interface FighterBannerInfo {
  allow_cross_play: boolean;
  battle_input_type: number;
  custom_room_invite_setting: number;
  enjoy_total_point: number;
  favorite_character_id: number;
  favorite_character_league_info: LeagueInfo;
  favorite_character_play_point: PlayPoint;
  friend_request_flag: boolean;
  friendship: number;
  home_id: number;
  inside_rank: number;
  is_circle_invite: boolean;
  is_circle_member: boolean;
  last_play_at: number;
  main_circle: {
    circle_id: string;
    circle_name: string;
    data_exist: boolean;
    emblem: Record<string, unknown>;
    leader: {
      fighter_id: string;
      platform_id: number;
      short_id: number;
    };
  };
  max_content_play_time: {
    content_type: number;
    play_time: number;
  };
  mobile_linkage: boolean;
  online_status_info: Record<string, unknown>;
  personal_info: PersonalInfo;
  play_time_zone: {
    end_hour: number;
    end_minute: number;
    start_hour: number;
    start_minute: number;
  };
  profile_comment: {
    profile_tag_id: number;
    tag_option_id: number;
  };
  title_plate: number;
  favorite_character_name: string;
  favorite_character_tool_name: string;
  title_data: {
    title_data_id: number;
    title_data_grade_id: number;
    title_data_grade_name: string;
    title_data_plate_id: number;
    title_data_plate_name: string;
    title_data_val: string;
  };
  home_name: string;
}

export interface RankingFighter {
  character_id: number;
  fighter_banner_info: FighterBannerInfo;
  league_point: number;
  league_rank: number;
  master_league: number;
  master_rating: number;
  master_rating_ranking: number;
  order: number;
  ranking_title_plate: number;
  character_name: string;
  character_tool_name: string;
  ranking_title_data: {
    title_data_id: number;
    title_data_grade_id: number;
    title_data_grade_name: string;
    title_data_plate_id: number;
    title_data_plate_name: string;
    title_data_val: string;
  };
}

export interface LeaguePointRanking {
  current_page: number;
  my_ranking_info: RankingFighter | null;
  ranking_fighter_list: RankingFighter[];
  total_count: number;
  total_page: number;
}

export interface NextData {
  props: {
    pageProps: {
      league_point_ranking: LeaguePointRanking;
      common: {
        statusCode: number;
        isError: boolean;
      };
    };
  };
}
