import { jsonObject, jsonMember, jsonArrayMember } from 'typedjson';
import { Chain } from '..';

@jsonObject
export class SocialMediaInfo {
  @jsonMember(String)
  public name: string; // platform
  @jsonMember(String)
  public url: string;
  @jsonMember(String)
  public handle: string;
}

@jsonObject
export class TokenInfoJSON {
  @jsonMember(String)
  public name: string;
  @jsonMember(String)
  public website?: string;
  @jsonMember(String)
  public source_code?: string;
  @jsonMember(String)
  public white_paper?: string;
  @jsonMember(String)
  public description: string;
  @jsonArrayMember(SocialMediaInfo)
  public socials?: SocialMediaInfo[];
  @jsonMember(String)
  public explorer: string;
  @jsonMember(String)
  public symbol: string;
  @jsonMember(String)
  public type: 'COIN';
  @jsonMember(Number)
  public decimals: number;
  @jsonMember(String)
  public status: 'active' | 'abandoned';
  @jsonArrayMember(String)
  public tags?: string[];
}

export interface TokenInfo extends TokenInfoJSON {
  chain: Chain;
}
