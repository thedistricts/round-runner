/**
 * @vitest-environment jsdom
 */

// import { get } from "svelte/store";
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event'

import { fireEvent, render, cleanup, screen } from '@testing-library/svelte';
import Upload from './Upload.svelte';
import FilePond from 'filepond';
import * as RatificationWorker from '$lib/workers/ratification.worker?worker';
import * as Comlink from 'comlink';

// vi.mock('svelte-filepond');
vi.mock('$lib/workers/ratification.worker');
// vi.mock('comlink');

describe('Upload component', () => {
  beforeEach(() => {
    // FilePond.mockClear();
    // RatificationWorker.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  // it('should create a FilePond instance with the correct options', () => {
  //   const { component } = render(Upload);
  //   expect(FilePond).toHaveBeenCalledTimes(1);
  //   expect(FilePond).toHaveBeenCalledWith(component.querySelector('input'), {
  //     allowMultiple: false,
  //     acceptedFileTypes: ['application/gpx+xml'],
  //     labelIdle: 'Drag & Drop your GPX file or <span class="filepond--label-action">Browse</span>',
  //   });
  // });

  it('should create a RatificationWorker instance when a file is added', async () => {
    // FilePond.mockReturnValueOnce({
      
    render(Upload);
    const file = new File([''], 'test.gpx', { type: 'application/gpx+xml' });
    const input = screen.getByLabelText('upload');
    await fireEvent.change(input, { target: { files: [file] } });
    userEvent.upload(input, file);
    // const workerMock = vi.spyOn(RatificationWorker, 'default');
    const ratifyMock = vi.fn().mockResolvedValue({ passed: true, message: '' });
    const wrapMock = vi.spyOn(Comlink, 'wrap').mockImplementation(() => ({ ratify: ratifyMock }));
    expect(wrapMock).toHaveBeenCalledTimes(1);
    expect(ratifyMock).toHaveBeenCalledTimes(1);
    // expect(workerMock).toHaveBeenCalledWith(file);
  });

  // it('should update the ratificationResults store when the RatificationWorker sends a message', async () => {
  //   const { component } = render(Upload);
  //   const file = new File([''], 'test.gpx', { type: 'application/gpx+xml' });
  //   // const filePondInstance = FilePond.mock.instances[0];
  //   // const ratificationWorkerInstance = RatificationWorker.mock.instances[0];
  //   await fireEvent.change(component.querySelector('input'), { target: { files: [file] } });
  //   const message = { data: { passed: true, message: '' } };
  //   RatificationWorker.onmessage(message);
  //   expect(component.$store.ratificationResults).toEqual({ passed: true, message: '' });
  // });

  // it('should reset the ratificationResults store when the reset button is clicked', async () => {
  //   const { component } = render(Upload);
  //   const file = new File([''], 'test.gpx', { type: 'application/gpx+xml' });
  //   // const filePondInstance = FilePond.mock.instances[0];
  //   const ratificationWorkerInstance = RatificationWorker.mock.instances[0];
  //   await fireEvent.change(component.querySelector('input'), { target: { files: [file] } });
  //   const message = { data: { passed: true, message: '' } };
  //   ratificationWorkerInstance.onmessage(message);
  //   const resetButtonElement = component.querySelector('button');
  //   await fireEvent.click(resetButtonElement);
  //   expect(component.$store.ratificationResults).toEqual(null);
  // });
});