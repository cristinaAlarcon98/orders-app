package com.example.orders.application;

import com.example.orders.domain.port.in.RunBatchUseCase;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.stereotype.Service;

@Service
public class BatchService implements RunBatchUseCase {

    private final JobLauncher jobLauncher;
    private final Job processOrdersJob;

    public BatchService(JobLauncher jobLauncher, Job processOrdersJob) {
        this.jobLauncher = jobLauncher;
        this.processOrdersJob = processOrdersJob;
    }

    @Override
    public void run() {
        try {
            JobParameters params = new JobParametersBuilder()
                    .addLong("timestamp", System.currentTimeMillis())
                    .toJobParameters();
            jobLauncher.run(processOrdersJob, params);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
