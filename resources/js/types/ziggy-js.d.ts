declare module 'ziggy-js' {
    import { Config, RouteParam } from 'ziggy-js';

    export default function route(
        name?: string,
        params?: RouteParam | RouteParam[],
        absolute?: boolean,
        config?: Config
    ): string;
}
