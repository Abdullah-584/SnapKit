import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ImageCompressor } from './ImageCompressor';
import { ImageResizer } from './ImageResizer';

function makeImageFile(name = 'photo.jpg', bytes = 2048): File {
  return new File([new Uint8Array(bytes)], name, { type: 'image/jpeg' });
}

async function uploadImage(user: ReturnType<typeof userEvent.setup>) {
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  expect(input).not.toBeNull();
  await user.upload(input, makeImageFile());
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Image Compressor flow', () => {
  it('validates, shows real sizes and produces a downloadable result', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ImageCompressor />
      </MemoryRouter>,
    );

    // Empty state → file picker
    expect(screen.getByText(/Choose an image or drop it here/i)).toBeInTheDocument();

    await uploadImage(user);

    // File details appear with real byte counts
    expect(await screen.findByText('photo.jpg')).toBeInTheDocument();
    expect(screen.getByText('2.00 KB')).toBeInTheDocument();

    // Compress and wait for the measured result
    await user.click(screen.getByRole('button', { name: /Compress image/i }));
    await screen.findByText(/Done — your file is ready/i);

    const download = screen.getByRole('link', { name: /Download JPEG/i });
    expect(download).toHaveAttribute('download', 'photo-snapkit.jpg');
    expect(download.getAttribute('href')).toMatch(/^blob:/);

    // Reduction line shows a computed figure, not a hardcoded one
    expect(screen.getByText(/^\d+\.\d% smaller$/)).toBeInTheDocument();
  });

  it('rejects unsupported files with a visible error', async () => {
    render(
      <MemoryRouter>
        <ImageCompressor />
      </MemoryRouter>,
    );
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    // fireEvent bypasses the `accept` attribute so the bad file actually lands.
    fireEvent.change(input, {
      target: { files: [new File([new Uint8Array(64)], 'animation.gif', { type: 'image/gif' })] },
    });
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/not a supported image/i);
  });

  it('warns when a transparency-capable source is exported to JPEG', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ImageCompressor />
      </MemoryRouter>,
    );
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(
      input,
      new File([new Uint8Array(1024)], 'logo.png', { type: 'image/png' }),
    );

    await screen.findByText('logo.png');
    await user.selectOptions(screen.getByLabelText(/Output format/i), 'image/jpeg');
    expect(await screen.findByText(/Transparency will be lost/i)).toBeInTheDocument();
  });
});

describe('Image Resizer flow', () => {
  it('resizes with an aspect-ratio lock and reports output dimensions', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/image-resizer/?width=1200&height=900']}>
        <ImageResizer />
      </MemoryRouter>,
    );

    await uploadImage(user);

    // Preloaded preset from the URL
    expect(await screen.findByLabelText(/Width \(px\)/i)).toHaveValue(1200);
    expect(screen.getByLabelText(/Height \(px\)/i)).toHaveValue(900);

    // Lock recalculates the other side (source is 400x300 → ratio 4:3)
    const width = screen.getByLabelText(/Width \(px\)/i);
    await user.clear(width);
    await user.type(width, '200');
    await waitFor(() => expect(screen.getByLabelText(/Height \(px\)/i)).toHaveValue(150));

    await user.click(screen.getByRole('button', { name: /Resize to 200 × 150/i }));
    await screen.findByText(/Done — your file is ready/i);
    expect(screen.getByRole('link', { name: /Download JPEG/i })).toBeInTheDocument();
  });

  it('warns when enlarging beyond the original', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ImageResizer />
      </MemoryRouter>,
    );
    await uploadImage(user);
    const width = await screen.findByLabelText(/Width \(px\)/i);
    await user.clear(width);
    await user.type(width, '3999');
    expect(await screen.findByText(/You are enlarging this image/i)).toBeInTheDocument();
  });
});
