export class ApiWrapper {
  private baseUrl: string;
  private wsUrl: string;

  constructor() {
    this.baseUrl = '/api/scanner';
    this.wsUrl = 'wss://api-rs.dexcelerate.com/ws';
  }

  async fetchScannerData(params: {
    rankBy: 'volume' | 'age';
    chain: string;
    isNotHP: boolean;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams({
      rankBy: params.rankBy,
      chain: params.chain,
      isNotHP: params.isNotHP.toString(),
      limit: (params.limit || 100).toString(),
    });

    const response = await fetch(`${this.baseUrl}?${queryParams}`);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return {data: await response.json()};
  }
}

// Export a singleton instance
export const apiWrapper = new ApiWrapper();
