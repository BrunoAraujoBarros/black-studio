import styled from "styled-components/native"

interface TextProps {
    wight?: '400' | '600' | '700',
    size?: number,
    color?: string,
    opacity?: number,
}

export const Text = styled.Text<TextProps>`
    font-family: ${({ weight }: { weight?: '400' | '600' | '700' }) => weight ? `GeneralSans-${weight}` : 'GeneralSans-400'};
    color: ${({ color }: { color?: string }) => color || '#333'};
    font-size: ${({ size }: { size?: number }) => size ? `${size}px` : '16px'};
    opacity: ${({ opacity }: { opacity?: number }) => opacity || 1};

`