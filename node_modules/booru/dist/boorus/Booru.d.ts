import InternalSearchParameters from '../structures/InternalSearchParameters';
import SearchParameters from '../structures/SearchParameters';
import SearchResults from '../structures/SearchResults';
import Site from '../structures/Site';
export declare class Booru {
    domain: string;
    site: Site;
    credentials: any;
    constructor(site: Site, credentials?: object | null);
    search(tags: string | string[], { limit, random, page }?: SearchParameters): Promise<SearchResults>;
    postView(id: string | number): string;
    protected doSearchRequest(tags: string[] | string, { uri, limit, random, page }?: InternalSearchParameters): Promise<any>;
    protected parseSearchResult(result: any, { fakeLimit, tags, limit, random, page }: InternalSearchParameters): SearchResults;
}
export default Booru;
